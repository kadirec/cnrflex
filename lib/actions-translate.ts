"use server";

import { generateText } from "ai";
import { getSession } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/sanitize";

const MODEL = "anthropic/claude-haiku-4.5";

const SYSTEM_TEXT = `You are a professional Turkish-to-English translator specializing in industrial rubber sealing and extrusion products (weatherstripping, gaskets, PVC/TPE/TPU profiles, shutters, joinery).

Translate the given Turkish product text into natural, technical English suitable for a manufacturer's product catalog. Keep the tone professional and concise. Preserve numbers, units, dimensions, product codes and brand names exactly. Do not add or remove information.

Return ONLY the translated text — no quotes, no explanation, no preamble.`;

const SYSTEM_HTML = `${SYSTEM_TEXT}

The input may contain HTML tags (p, strong, em, u, s, h2, h3, ul, ol, li, blockquote, code, pre, a, br, hr). Preserve the exact HTML structure and every tag — translate ONLY the visible text between tags. Do not add, remove, or reorder tags.`;

export type TranslateResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function translateToEn(
  input: string,
  kind: "text" | "html" = "text",
): Promise<TranslateResult> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Çevrilecek metin boş" };
  if (trimmed.length > 20000) return { ok: false, error: "Metin çok uzun (max 20000 karakter)" };

  try {
    const { text } = await generateText({
      model: MODEL,
      system: kind === "html" ? SYSTEM_HTML : SYSTEM_TEXT,
      prompt: trimmed,
    });
    const out = kind === "html" ? sanitizeHtml(text) : text.trim();
    if (!out) return { ok: false, error: "Boş çeviri döndü" };
    return { ok: true, text: out };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Çeviri servisi hatası";
    return { ok: false, error: msg };
  }
}
