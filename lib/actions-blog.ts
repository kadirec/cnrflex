"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import "@/lib/zod-tr";
import { getSession } from "@/lib/auth";
import { getDb, blogPosts, type BlogCategory } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";

const CATEGORY_SLUGS = [
  "malzeme-rehberleri",
  "uygulama-rehberleri",
  "uretim-teknolojileri",
  "satin-alma-rehberleri",
] as const;

const blogSchema = z.object({
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  category: z.enum(CATEGORY_SLUGS),
  titleTr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  excerptTr: z.string().max(500).optional().nullable(),
  excerptEn: z.string().max(500).optional().nullable(),
  contentTr: z.string().min(1).max(50000),
  contentEn: z.string().min(1).max(50000),
  coverImageUrl: z.string().optional().nullable(),
  author: z.string().max(80).default("CNR Seal"),
  readingTime: z.coerce.number().int().min(1).max(120).default(3),
  publishedAt: z.date().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export type BlogFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseFormData(fd: FormData) {
  const get = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const titleTr = get("titleTr");
  const slugRaw = get("slug") || slugify(titleTr);
  const publishedRaw = get("publishedAt");
  const isPublished = get("isPublished") === "on" || get("isPublished") === "true";

  let publishedAt: Date | null = null;
  if (isPublished) {
    publishedAt = publishedRaw ? new Date(publishedRaw) : new Date();
    if (Number.isNaN(publishedAt.getTime())) publishedAt = new Date();
  }

  return {
    slug: slugRaw,
    category: get("category") as BlogCategory,
    titleTr,
    titleEn: get("titleEn") || titleTr,
    excerptTr: get("excerptTr") || null,
    excerptEn: get("excerptEn") || null,
    contentTr: sanitizeHtml(get("contentTr")),
    contentEn: sanitizeHtml(get("contentEn")) || sanitizeHtml(get("contentTr")),
    coverImageUrl: get("coverImageUrl") || null,
    author: get("author") || "CNR Seal",
    readingTime: get("readingTime") || "3",
    publishedAt,
    sortOrder: get("sortOrder") || "0",
  };
}

async function ensureUniqueSlug(
  db: ReturnType<typeof getDb>,
  baseSlug: string,
  excludeId?: number,
): Promise<string> {
  let candidate = baseSlug;
  for (let n = 2; n < 1000; n++) {
    const clash = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(
        excludeId !== undefined
          ? and(eq(blogPosts.slug, candidate), ne(blogPosts.id, excludeId))
          : eq(blogPosts.slug, candidate),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
    candidate = `${baseSlug}-${n}`;
  }
  return `${baseSlug}-${Date.now()}`;
}

function revalidatePublicBlogPaths() {
  revalidatePath("/[locale]/blog", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");
}

async function requireAuth(): Promise<BlogFormState | null> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };
  return null;
}

export async function createBlogPost(_prev: BlogFormState, fd: FormData): Promise<BlogFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = blogSchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  const slug = await ensureUniqueSlug(db, parsed.data.slug);
  try {
    await db.insert(blogPosts).values({ ...parsed.data, slug });
  } catch {
    return { ok: false, error: "Kayıt sırasında hata oluştu" };
  }

  revalidatePath("/panel/blog");
  revalidatePublicBlogPaths();
  redirect("/panel/blog");
}

export async function updateBlogPost(
  id: number,
  _prev: BlogFormState,
  fd: FormData,
): Promise<BlogFormState> {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const parsed = blogSchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  const slug = await ensureUniqueSlug(db, parsed.data.slug, id);
  try {
    await db
      .update(blogPosts)
      .set({ ...parsed.data, slug, updatedAt: new Date() })
      .where(eq(blogPosts.id, id));
  } catch {
    return { ok: false, error: "Güncelleme sırasında hata oluştu" };
  }

  revalidatePath("/panel/blog");
  revalidatePath(`/panel/blog/${id}`);
  revalidatePublicBlogPaths();
  return { ok: true };
}

export async function deleteBlogPost(id: number): Promise<{ ok: boolean; error?: string }> {
  const unauth = await requireAuth();
  if (unauth) return { ok: false, error: unauth.error };

  const db = getDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/panel/blog");
  revalidatePublicBlogPaths();
  return { ok: true };
}
