"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getDb, categories } from "@/lib/db";
import { slugify } from "@/lib/slug";

const categorySchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  nameTr: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  shortDescriptionTr: z.string().max(500).optional().nullable(),
  shortDescriptionEn: z.string().max(500).optional().nullable(),
  descriptionTr: z.string().max(5000).optional().nullable(),
  descriptionEn: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  iconUrl: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryFormState = {
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

  return {
    slug: slugRaw,
    nameTr,
    nameEn: get("nameEn"),
    shortDescriptionTr: get("shortDescriptionTr") || null,
    shortDescriptionEn: get("shortDescriptionEn") || null,
    descriptionTr: get("descriptionTr") || null,
    descriptionEn: get("descriptionEn") || null,
    imageUrl: get("imageUrl") || null,
    iconUrl: get("iconUrl") || null,
    sortOrder: get("sortOrder") || "0",
  };
}

async function requireAuth(): Promise<CategoryFormState | null> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };
  return null;
}

export async function createCategory(_prev: CategoryFormState, fd: FormData): Promise<CategoryFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = categorySchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  try {
    await db.insert(categories).values(parsed.data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { ok: false, error: "Bu slug zaten kullanımda", fieldErrors: { slug: "Kullanımda" } };
    }
    return { ok: false, error: "Kayıt sırasında hata oluştu" };
  }

  revalidatePath("/panel/categories");
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
  redirect("/panel/categories");
}

export async function updateCategory(id: number, _prev: CategoryFormState, fd: FormData): Promise<CategoryFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = categorySchema.safeParse(parseFormData(fd));
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
      .update(categories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(categories.id, id));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { ok: false, error: "Bu slug zaten kullanımda", fieldErrors: { slug: "Kullanımda" } };
    }
    return { ok: false, error: "Güncelleme sırasında hata oluştu" };
  }

  revalidatePath("/panel/categories");
  revalidatePath(`/panel/categories/${id}`);
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
  return { ok: true };
}

export async function deleteCategory(id: number): Promise<{ ok: boolean; error?: string }> {
  const unauth = await requireAuth();
  if (unauth) return { ok: false, error: unauth.error };

  const db = getDb();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/panel/categories");
  revalidatePath("/tr/urunler");
  revalidatePath("/en/urunler");
  return { ok: true };
}
