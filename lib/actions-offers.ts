"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import "@/lib/zod-tr";
import { getSession } from "@/lib/auth";
import { getDb, offers, offerDefaults, quotes } from "@/lib/db";

const num = (min: number, max: number) => z.number().finite().min(min).max(max);
const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const itemSchema = z.object({
  productId: z.number().int().positive().nullable().optional(),
  code: z.string().trim().max(80),
  name: z.string().trim().min(1, "Ürün adı boş olamaz").max(300),
  image: z.string().max(1000).nullable().optional(),
  quantity: num(0, 100_000_000),
  packageSize: num(0, 1_000_000).nullable().optional(),
  unitPrice: num(0, 10_000_000),
  cardPrices: z.record(z.string(), num(0, 10_000_000)).optional(),
});

const settingsSchema = z.object({
  vatRate: num(0, 100),
  showCard: z.boolean(),
  installments: z
    .array(z.object({ count: z.number().int().min(1).max(36), rate: num(0, 500) }))
    .max(8),
  showDeferred: z.boolean(),
  deferredLabel: z.enum(["Senet", "Çek"]),
  monthlyRate: num(0, 100),
  downPaymentRate: num(0, 100),
  termDays: z.array(z.number().int().min(1).max(720)).max(8),
  transferDiscount: num(0, 100),
});

const offerSchema = z.object({
  offerDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih"),
  customerName: z.string().trim().min(1, "Müşteri adı zorunlu").max(200),
  contactPerson: optText(200),
  phone: optText(60),
  email: optText(200),
  address: optText(1000),
  taxOffice: optText(200),
  taxNumber: optText(60),
  items: z.array(itemSchema).min(1, "En az bir ürün ekleyin").max(100),
  settings: settingsSchema,
  notes: optText(4000),
  sourceQuoteId: z.number().int().positive().nullable(),
});

export type OfferInput = z.input<typeof offerSchema>;
export type SaveOfferResult = { ok: true; id: number } | { ok: false; error: string };

export async function saveOffer(input: OfferInput, id?: number): Promise<SaveOfferResult> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  const parsed = offerSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue?.message ?? "Geçersiz veri" };
  }
  const data = parsed.data;
  const db = getDb();

  let savedId = id;
  if (id) {
    const res = await db
      .update(offers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(offers.id, id))
      .returning({ id: offers.id });
    if (res.length === 0) return { ok: false, error: "Teklif bulunamadı" };
  } else {
    const [row] = await db.insert(offers).values(data).returning({ id: offers.id });
    savedId = row.id;

    // Talepten dönüştürüldüyse talebi okundu + "Devam ediyor" yap
    if (data.sourceQuoteId) {
      await db
        .update(quotes)
        .set({ isRead: true, readAt: new Date(), updatedAt: new Date() })
        .where(and(eq(quotes.id, data.sourceQuoteId), eq(quotes.isRead, false)));
      await db
        .update(quotes)
        .set({ status: "in_progress", updatedAt: new Date() })
        .where(and(eq(quotes.id, data.sourceQuoteId), eq(quotes.status, "new")));
      revalidatePath(`/panel/quotes/${data.sourceQuoteId}`);
      revalidatePath("/panel", "layout");
    }
  }

  revalidatePath("/panel/quotes");
  revalidatePath(`/panel/quotes/offers/${savedId}`);
  return { ok: true, id: savedId! };
}

export async function deleteOffer(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  await getDb().delete(offers).where(eq(offers.id, id));
  revalidatePath("/panel/quotes");
  return { ok: true };
}

const defaultsSchema = z.object({ settings: settingsSchema, notes: optText(4000) });

export async function saveOfferDefaults(
  input: z.input<typeof defaultsSchema>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  const parsed = defaultsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri" };

  const values = { id: 1, ...parsed.data, updatedAt: new Date() };
  await getDb()
    .insert(offerDefaults)
    .values(values)
    .onConflictDoUpdate({ target: offerDefaults.id, set: values });

  revalidatePath("/panel/quotes/offers/settings");
  return { ok: true };
}
