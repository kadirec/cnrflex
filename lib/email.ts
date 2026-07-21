import { Resend } from "resend";
import { siteConfig } from "./site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const fromAddress = process.env.RESEND_FROM ?? `${siteConfig.name} <noreply@cnrseal.com>`;
const toAddress = process.env.RESEND_TO ?? siteConfig.contact.email;

export type EmailAttachment = {
  filename: string;
  content: Buffer;
};

export type EmailPayload = {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

export async function sendEmail({ subject, html, replyTo, attachments }: EmailPayload) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping send");
    return { ok: false, reason: "not_configured" as const };
  }
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject,
      html,
      replyTo,
      attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content })),
    });
    if (error) {
      console.error("[email] resend error:", error);
      return { ok: false, reason: "provider_error" as const };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("[email] unexpected error:", err);
    return { ok: false, reason: "exception" as const };
  }
}
