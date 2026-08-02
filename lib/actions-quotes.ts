"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getDb, quotes, type QuoteNote } from "@/lib/db";
import { isQuoteStatus } from "@/lib/quote-status";

type Result = { ok: true } | { ok: false; error: string };

async function requireAuth(): Promise<Result | null> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };
  return null;
}

function revalidateAll(id?: number) {
  revalidatePath("/panel/quotes");
  revalidatePath("/panel", "layout");
  if (id !== undefined) revalidatePath(`/panel/quotes/${id}`);
}

export async function markQuoteRead(id: number): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const db = getDb();
  await db
    .update(quotes)
    .set({ isRead: true, readAt: new Date(), updatedAt: new Date() })
    .where(eq(quotes.id, id));

  revalidateAll(id);
  return { ok: true };
}

export async function markQuoteUnread(id: number): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const db = getDb();
  await db
    .update(quotes)
    .set({ isRead: false, readAt: null, updatedAt: new Date() })
    .where(eq(quotes.id, id));

  revalidateAll(id);
  return { ok: true };
}

export async function updateQuoteStatus(id: number, status: string): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  if (!isQuoteStatus(status)) return { ok: false, error: "Geçersiz durum" };

  const db = getDb();
  await db
    .update(quotes)
    .set({ status, updatedAt: new Date() })
    .where(eq(quotes.id, id));

  revalidateAll(id);
  return { ok: true };
}

export async function addQuoteNote(id: number, text: string): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "Not boş olamaz" };
  if (trimmed.length > 4000) return { ok: false, error: "Not çok uzun" };

  const session = await getSession();
  const note: QuoteNote = {
    author: session.userId ?? "admin",
    text: trimmed,
    createdAt: new Date().toISOString(),
  };

  const db = getDb();
  await db
    .update(quotes)
    .set({
      notes: sql`COALESCE(${quotes.notes}, '[]'::jsonb) || ${JSON.stringify([note])}::jsonb`,
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, id));

  revalidateAll(id);
  return { ok: true };
}

export async function deleteQuoteNote(id: number, index: number): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const db = getDb();
  const [row] = await db
    .select({ notes: quotes.notes })
    .from(quotes)
    .where(eq(quotes.id, id))
    .limit(1);
  if (!row) return { ok: false, error: "Kayıt bulunamadı" };

  const current = Array.isArray(row.notes) ? row.notes : [];
  if (index < 0 || index >= current.length) return { ok: false, error: "Geçersiz not" };

  const next = current.filter((_, i) => i !== index);
  await db
    .update(quotes)
    .set({ notes: next, updatedAt: new Date() })
    .where(eq(quotes.id, id));

  revalidateAll(id);
  return { ok: true };
}

export async function deleteQuote(id: number): Promise<Result> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const db = getDb();
  await db.delete(quotes).where(eq(quotes.id, id));

  revalidateAll();
  return { ok: true };
}
