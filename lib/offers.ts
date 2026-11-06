import "server-only";
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
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
      draft.items = (quote.items ?? []).map((it) => {
        const fromRolls =
          it.rollCount && it.rollLength ? it.rollCount * it.rollLength : undefined;
        const parsed = Number(String(it.quantity ?? "").replace(/[^\d.,]/g, "").replace(",", "."));
        return {
          productId: it.productId ?? null,
          code: it.code,
          name: it.name,
          image: it.image ?? null,
          quantity: fromRolls ?? (Number.isFinite(parsed) ? parsed : 0),
          packageSize: it.rollLength ?? null,
          unitPrice: 0,
        };
      });
    }
  }

  return draft;
}
