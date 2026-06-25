import { NextResponse } from "next/server";
import { z } from "zod";

import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

const payloadSchema = z.object({
  type: z.enum(["quote", "contact"]),
  locale: z.enum(["tr", "en"]),
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().min(5).max(40).optional().or(z.string().max(0)),
  product: z.string().max(100).optional(),
  quantity: z.string().max(60).optional(),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(),
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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const subjectPrefix = data.type === "quote" ? "Teklif Talebi" : "İletişim Formu";
    const subject = `[${siteConfig.name}] ${subjectPrefix} — ${data.name}`;

    const rows: [string, string | undefined][] = [
      ["İsim / Name", data.name],
      ["Firma / Company", data.company],
      ["E-posta / Email", data.email],
      ["Telefon / Phone", data.phone],
      ["Ürün / Product", data.product],
      ["Miktar / Quantity", data.quantity],
      ["Dil / Locale", data.locale],
      ["IP", ip],
    ];

    const tableRows = rows
      .filter(([, v]) => v && v.length > 0)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#555">${escape(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:600">${escape(String(v))}</td></tr>`)
      .join("");

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto">
        <h2 style="color:#122648">${escape(subjectPrefix)}</h2>
        <table style="border-collapse:collapse;width:100%;background:#fafafa;border-radius:8px;overflow:hidden">${tableRows}</table>
        <div style="margin-top:20px">
          <div style="font-weight:600;color:#555;margin-bottom:8px">Mesaj / Message</div>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${escape(data.message)}</div>
        </div>
      </div>
    `;

    const result = await sendEmail({ subject, html, replyTo: data.email });
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.reason }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact api]", err);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 500 });
  }
}
