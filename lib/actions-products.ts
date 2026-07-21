"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getDb, products, type ProductSpec } from "@/lib/db";
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
  descriptionTr: z.string().max(3000).optional().nullable(),
  descriptionEn: z.string().max(3000).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
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

  return {
    categoryId: get("categoryId"),
    code: get("code"),
    slug: slugRaw,
    nameTr,
    nameEn: get("nameEn"),
    descriptionTr: get("descriptionTr") || null,
    descriptionEn: get("descriptionEn") || null,
    imageUrl: get("imageUrl") || null,
    sortOrder: get("sortOrder") || "0",
    specs,
  };
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
  try {
    await db.insert(products).values(parsed.data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        ok: false,
        error: "Aynı kategoride bu slug zaten kullanımda",
        fieldErrors: { slug: "Bu kategoride kullanımda" },
      };
    }
    return { ok: false, error: "Kayıt sırasında hata oluştu" };
  }

  revalidatePath("/panel/products");
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
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
  try {
    await db
      .update(products)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(products.id, id));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return {
        ok: false,
        error: "Aynı kategoride bu slug zaten kullanımda",
        fieldErrors: { slug: "Bu kategoride kullanımda" },
      };
    }
    return { ok: false, error: "Güncelleme sırasında hata oluştu" };
  }

  revalidatePath("/panel/products");
  revalidatePath(`/panel/products/${id}`);
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
  return { ok: true };
}

export async function deleteProduct(id: number): Promise<{ ok: boolean; error?: string }> {
  const unauth = await requireAuth();
  if (unauth) return { ok: false, error: unauth.error };

  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/panel/products");
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
  return { ok: true };
}
