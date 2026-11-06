import "server-only";
import { asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import {
  getDb,
  offers,
  offerDefaults,
  products,
  categories,
  type Offer,
  type OfferItem,
  type OfferSettings,
} from "@/lib/db";
import { getQuote } from "@/lib/quotes";
import { DEFAULT_OFFER_SETTINGS, DEFAULT_OFFER_NOTES, todayIso } from "@/lib/offer-calc";

export async function listOffers(input: { q?: string; limit?: number } = {}): Promise<Offer[]> {
  const db = getDb();
  const where = input.q
    ? or(
        ilike(offers.customerName, `%${input.q}%`),
        ilike(offers.contactPerson, `%${input.q}%`),
        ilike(offers.phone, `%${input.q}%`),
        ilike(offers.email, `%${input.q}%`),
      )
    : undefined;
  return db
    .select()
    .from(offers)
    .where(where)
    .orderBy(desc(offers.createdAt))
    .limit(input.limit ?? 200);
}

export async function getOffer(id: number): Promise<Offer | undefined> {
  const db = getDb();
  const [row] = await db.select().from(offers).where(eq(offers.id, id)).limit(1);
  return row;
}

export type LinkedOffer = { id: number; offerDate: string };

/** Talep id → o talepten hazırlanan teklifler (yeniden eskiye). */
export async function offersBySourceQuote(quoteIds: number[]): Promise<Map<number, LinkedOffer[]>> {
  const out = new Map<number, LinkedOffer[]>();
  if (quoteIds.length === 0) return out;
  try {
    const rows = await getDb()
      .select({ id: offers.id, offerDate: offers.offerDate, sourceQuoteId: offers.sourceQuoteId })
      .from(offers)
      .where(inArray(offers.sourceQuoteId, quoteIds))
      .orderBy(desc(offers.createdAt));
    for (const r of rows) {
      if (r.sourceQuoteId == null) continue;
      const list = out.get(r.sourceQuoteId) ?? [];
      list.push({ id: r.id, offerDate: r.offerDate });
      out.set(r.sourceQuoteId, list);
    }
  } catch (e) {
    console.error("bağlı teklifler okunamadı", e);
  }
  return out;
}

export async function countOffers(): Promise<number> {
  try {
    const [row] = await getDb().select({ n: sql<number>`count(*)::int` }).from(offers);
    return row?.n ?? 0;
  } catch (e) {
    // Tablo henüz oluşturulmadıysa gelen talepler sayfası bozulmasın
    console.error("offers sayılamadı", e);
    return 0;
  }
}

export type OfferProductOption = {
  id: number;
  code: string;
  name: string;
  image: string | null;
  rollLength: number | null;
  categoryName: string;
};

export async function listOfferProducts(): Promise<OfferProductOption[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: products.id,
      code: products.code,
      name: products.nameTr,
      imageUrl: products.imageUrl,
      images: products.images,
      rollLength: products.rollLength,
      categoryName: categories.nameTr,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.nameTr), asc(products.sortOrder), asc(products.code));
  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name,
    image: (Array.isArray(r.images) && r.images[0]) || r.imageUrl || null,
    rollLength: r.rollLength,
    categoryName: r.categoryName,
  }));
}

export type OfferDraft = {
  offerDate: string;
  customerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxOffice: string;
  taxNumber: string;
  items: OfferItem[];
  settings: OfferSettings;
  notes: string;
  sourceQuoteId: number | null;
};

export type ResolvedOfferDefaults = { settings: OfferSettings; notes: string };

/** Teklif Ayarları'nda kaydedilen varsayılanlar; kayıt yoksa sabit varsayılanlar. */
export async function getOfferDefaults(): Promise<ResolvedOfferDefaults> {
  try {
    const [row] = await getDb().select().from(offerDefaults).where(eq(offerDefaults.id, 1)).limit(1);
    if (row) {
      return {
        settings: { ...DEFAULT_OFFER_SETTINGS, ...row.settings },
        notes: row.notes ?? DEFAULT_OFFER_NOTES,
      };
    }
  } catch (e) {
    console.error("offer_defaults okunamadı", e);
  }
  return { settings: DEFAULT_OFFER_SETTINGS, notes: DEFAULT_OFFER_NOTES };
}

/** Yeni teklif için başlangıç değerleri: Teklif Ayarları + (varsa) gelen talepten müşteri/ürünler. */
export async function buildOfferDraft(fromQuoteId?: number): Promise<OfferDraft> {
  const defaults = await getOfferDefaults();
  const db = getDb();

  const draft: OfferDraft = {
    offerDate: todayIso(),
    customerName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxOffice: "",
    taxNumber: "",
    items: [],
    settings: defaults.settings,
    notes: defaults.notes,
    sourceQuoteId: null,
  };

  if (fromQuoteId) {
    const quote = await getQuote(fromQuoteId);
    if (quote) {
      draft.sourceQuoteId = quote.id;
      draft.customerName = quote.company || quote.name;
      draft.contactPerson = quote.company ? quote.name : "";
      draft.phone = quote.phone ?? "";
      draft.email = quote.email ?? "";
      const quoteItems = quote.items ?? [];
      const ids = quoteItems.map((it) => it.productId).filter((x): x is number => typeof x === "number");
      const rollById = new Map<number, number | null>();
      if (ids.length > 0) {
        const rows = await db
          .select({ id: products.id, rollLength: products.rollLength })
          .from(products)
          .where(inArray(products.id, ids));
        for (const r of rows) rollById.set(r.id, r.rollLength);
      }
      draft.items = quoteItems.map((it) => {
        const parsed = parseQuoteQuantity(it.quantity);
        const fromRolls = it.rollCount && it.rollLength ? it.rollCount * it.rollLength : null;
        return {
          productId: it.productId ?? null,
          code: it.code,
          name: it.name,
          image: it.image ?? null,
          quantity: fromRolls ?? parsed.total ?? 0,
          packageSize:
            it.rollLength ?? parsed.rollLength ?? (it.productId ? rollById.get(it.productId) ?? null : null),
          unitPrice: 0,
        };
      });
    }
  }

  return draft;
}

function toNumber(raw: string): number | null {
  // "1.000" / "1.000,5" (TR) ve "1000.5" biçimlerini destekle
  const t = raw.trim();
  const n = t.includes(",")
    ? Number(t.replace(/\./g, "").replace(",", "."))
    : /^\d{1,3}(\.\d{3})+$/.test(t)
      ? Number(t.replace(/\./g, ""))
      : Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Sitedeki teklif formunun miktar metnini çözer.
 * Örn. "5 top × 100 MT = 500 MT" → { total: 500, rollLength: 100 }; "2000 metre" → { total: 2000 }
 */
export function parseQuoteQuantity(q: string | null | undefined): { total: number | null; rollLength: number | null } {
  if (!q) return { total: null, rollLength: null };
  const nums = q.match(/\d[\d.,]*/g) ?? [];
  const roll = q.match(/[×x*]\s*(\d[\d.,]*)/i);
  const eq = q.match(/=\s*(\d[\d.,]*)/);
  const total = eq ? toNumber(eq[1]) : nums[0] ? toNumber(nums[0]) : null;
  return { total, rollLength: roll ? toNumber(roll[1]) : null };
}
