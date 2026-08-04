"use server";

import { and, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import "@/lib/zod-tr";
import { getSession } from "@/lib/auth";
import { getDb, products, type ProductSpec } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";

const specSchema = z.object({
  label: z.object({ tr: z.string().min(1), en: z.string().min(1) }),
  value: z.object({ tr: z.string().min(1), en: z.string().min(1) }),
});

const productSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  code: z.string().min(1).max(60),
  slug: z.string().min(1).max(140).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  nameTr: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  descriptionTr: z.string().max(20000).optional().nullable(),
  descriptionEn: z.string().max(20000).nullable(),
  imageUrl: z.string().optional().nullable(),
  images: z.array(z.string().url()).max(8).optional().nullable(),
  rollLength: z
    .union([z.coerce.number().int().min(1).max(100000), z.literal("").transform(() => null), z.null()])
    .nullable(),
  sortOrder: z.coerce.number().int().default(0),
  specs: z.array(specSchema).max(30).optional().nullable(),
});

export type ProductFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseFormData(fd: FormData) {
  const get = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const nameTr = get("nameTr");
  const slugRaw = get("slug") || slugify(nameTr);

  let specs: ProductSpec[] | null = null;
  const specsJson = get("specsJson");
  if (specsJson) {
    try {
      const parsed = JSON.parse(specsJson);
      if (Array.isArray(parsed) && parsed.length > 0) specs = parsed;
    } catch {
      // ignore
    }
  }

  let images: string[] | null = null;
  const imagesJson = get("imagesJson");
  if (imagesJson) {
    try {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed)) {
        images = parsed.filter((x): x is string => typeof x === "string" && x.length > 0).slice(0, 8);
        if (images.length === 0) images = null;
      }
    } catch {
      // ignore
    }
  }

  const nameEnRaw = get("nameEn");
  const descTr = sanitizeHtml(get("descriptionTr"));
  const descEn = sanitizeHtml(get("descriptionEn"));

  return {
    categoryId: get("categoryId"),
    code: get("code"),
    slug: slugRaw,
    nameTr,
    nameEn: nameEnRaw || nameTr,
    descriptionTr: descTr || null,
    descriptionEn: descEn || descTr || null,
    imageUrl: images?.[0] ?? null,
    images,
    rollLength: get("rollLength") || null,
    sortOrder: get("sortOrder") || "0",
    specs,
  };
}

async function ensureUniqueSlug(
  db: ReturnType<typeof getDb>,
  categoryId: number,
  baseSlug: string,
  excludeId?: number,
): Promise<string> {
  let candidate = baseSlug;
  for (let n = 2; n < 1000; n++) {
    const clash = await db
      .select({ id: products.id })
      .from(products)
      .where(
        excludeId !== undefined
          ? and(
              eq(products.categoryId, categoryId),
              eq(products.slug, candidate),
              ne(products.id, excludeId),
            )
          : and(eq(products.categoryId, categoryId), eq(products.slug, candidate)),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
    candidate = `${baseSlug}-${n}`;
  }
  return `${baseSlug}-${Date.now()}`;
}

function revalidatePublicProductPaths() {
  revalidatePath("/[locale]/urunler", "page");
  revalidatePath("/[locale]/urunler/[category]", "page");
  revalidatePath("/[locale]/urunler/[category]/[product]", "page");
}

async function requireAuth(): Promise<ProductFormState | null> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };
  return null;
}

export async function createProduct(_prev: ProductFormState, fd: FormData): Promise<ProductFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = productSchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  const slug = await ensureUniqueSlug(db, parsed.data.categoryId, parsed.data.slug);
  try {
    await db.insert(products).values({ ...parsed.data, slug });
  } catch {
    return { ok: false, error: "Kayıt sırasında hata oluştu" };
  }

  revalidatePath("/panel/products");
  revalidatePublicProductPaths();
  redirect("/panel/products");
}

export async function updateProduct(
  id: number,
  _prev: ProductFormState,
  fd: FormData,
): Promise<ProductFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = productSchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  const slug = await ensureUniqueSlug(db, parsed.data.categoryId, parsed.data.slug, id);
  try {
    await db
      .update(products)
      .set({ ...parsed.data, slug, updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch {
    return { ok: false, error: "Güncelleme sırasında hata oluştu" };
  }

  revalidatePath("/panel/products");
  revalidatePath(`/panel/products/${id}`);
  revalidatePublicProductPaths();
  return { ok: true };
}

export async function deleteProduct(id: number): Promise<{ ok: boolean; error?: string }> {
  const unauth = await requireAuth();
  if (unauth) return { ok: false, error: unauth.error };

  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/panel/products");
  revalidatePublicProductPaths();
  return { ok: true };
}

export async function deleteProducts(
  ids: number[],
): Promise<{ ok: boolean; count?: number; error?: string }> {
  const unauth = await requireAuth();
  if (unauth) return { ok: false, error: unauth.error };

  const clean = Array.from(new Set(ids.filter((n) => Number.isInteger(n) && n > 0)));
  if (clean.length === 0) return { ok: false, error: "Seçim yok" };

  const db = getDb();
  await db.delete(products).where(inArray(products.id, clean));
  revalidatePath("/panel/products");
  revalidatePublicProductPaths();
  return { ok: true, count: clean.length };
}
