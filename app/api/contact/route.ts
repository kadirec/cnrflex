import { NextResponse } from "next/server";
import { z } from "zod";

import { sendEmail, type EmailAttachment } from "@/lib/email";
import { getDb, quotes } from "@/lib/db";
import { siteConfig } from "@/lib/site";

const MAX_ATTACHMENTS = 4;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const itemSchema = z.object({
  productId: z.number().int().positive().optional(),
  code: z.string().min(1).max(60),
  name: z.string().min(1).max(300),
  image: z.string().nullable().optional(),
  categoryName: z.string().max(200).optional(),
  categorySlug: z.string().max(200).optional(),
  slug: z.string().max(200).optional(),
  quantity: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

const payloadSchema = z.object({
  type: z.enum(["quote", "contact", "custom"]),
  locale: z.enum(["tr", "en"]),
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().regex(/^\+\d{7,15}$/).optional().or(z.literal("")),
  category: z.string().max(100).optional(),
  customCategory: z.string().max(120).optional(),
  quantity: z.string().max(60).optional(),
  message: z.string().max(5000).optional().default(""),
  website: z.string().max(0).optional(),
  items: z.array(itemSchema).max(50).optional(),
});

const ipBucket = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = ipBucket.get(ip);
  if (!entry || entry.reset < now) {
    ipBucket.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function escape(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const SUBJECT_PREFIX: Record<"quote" | "contact" | "custom", string> = {
  quote: "Teklif Talebi",
  contact: "İletişim Formu",
  custom: "Özel Ürün Talebi",
};

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    const fields: Record<string, string> = {};
    const attachments: EmailAttachment[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (key === "attachments") {
          if (!(value instanceof File)) continue;
          if (attachments.length >= MAX_ATTACHMENTS) continue;
          if (value.size === 0 || value.size > MAX_ATTACHMENT_SIZE) continue;
          if (!ALLOWED_MIME.includes(value.type)) continue;
          const buf = Buffer.from(await value.arrayBuffer());
          attachments.push({ filename: value.name, content: buf });
        } else if (typeof value === "string") {
          fields[key] = value;
        }
      }
    } else {
      const body = await request.json();
      Object.assign(fields, body);
    }

    const parsed = payloadSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;

    let savedToDb = false;
    try {
      await getDb().insert(quotes).values({
        type: data.type,
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        categorySlug: data.category || null,
        categoryLabel: data.category || null,
        customCategory: data.customCategory || null,
        quantity: data.quantity || null,
        message: data.message,
        locale: data.locale,
        ip,
        userAgent,
        items: data.items ?? [],
      });
      savedToDb = true;
    } catch (dbErr) {
      console.error("[contact api] quote insert failed", dbErr);
    }

    const subjectPrefix = SUBJECT_PREFIX[data.type];
    const subject = `[${siteConfig.name}] ${subjectPrefix} — ${data.name}`;
    const categoryValue = data.customCategory?.trim() || data.category;

    const rows: [string, string | undefined][] = [
      ["İsim / Name", data.name],
      ["Firma / Company", data.company],
      ["E-posta / Email", data.email],
      ["Telefon / Phone", data.phone],
      ["Kategori / Category", categoryValue],
      ["Miktar / Quantity", data.quantity],
      ["Dil / Locale", data.locale],
      ["IP", ip],
    ];

    if (attachments.length > 0) {
      rows.push(["Ek / Attachments", `${attachments.length}`]);
    }

    const tableRows = rows
      .filter(([, v]) => v && v.length > 0)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#555">${escape(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:600">${escape(String(v))}</td></tr>`)
      .join("");

    const itemsHtml =
      data.items && data.items.length > 0
        ? `
        <div style="margin-top:20px">
          <div style="font-weight:600;color:#555;margin-bottom:8px">Seçilen Ürünler / Selected Products (${data.items.length})</div>
          <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;overflow:hidden">
            ${data.items
              .map(
                (it) => `
              <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#122648">${escape(it.name)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555;font-family:monospace;font-size:12px">${escape(it.code)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555">${escape(it.quantity ?? "-")}</td>
              </tr>
              ${it.note ? `<tr><td colspan="3" style="padding:4px 12px 8px;color:#666;font-style:italic;border-bottom:1px solid #eee">${escape(it.note)}</td></tr>` : ""}
            `,
              )
              .join("")}
          </table>
        </div>`
        : "";

    const messageHtml = data.message?.trim()
      ? `
        <div style="margin-top:20px">
          <div style="font-weight:600;color:#555;margin-bottom:8px">Mesaj / Message</div>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${escape(data.message)}</div>
        </div>`
      : "";

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto">
        <h2 style="color:#122648">${escape(subjectPrefix)}</h2>
        <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;overflow:hidden">${tableRows}</table>
        ${itemsHtml}
        ${messageHtml}
      </div>
    `;

    const result = await sendEmail({
      subject,
      html,
      replyTo: data.email,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    if (!result.ok) {
      console.warn("[contact api] email delivery failed", { reason: result.reason, savedToDb });
      if (!savedToDb) {
        return NextResponse.json({ ok: false, error: result.reason }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact api]", err);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 500 });
  }
}
