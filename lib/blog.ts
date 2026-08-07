import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, isNotNull, lte } from "drizzle-orm";
import { getDb, blogPosts, type BlogPost } from "@/lib/db";

export { BLOG_CATEGORIES, getCategoryLabel } from "./blog-categories";

export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const db = getDb();
    return await db
      .select()
      .from(blogPosts)
      .where(and(isNotNull(blogPosts.publishedAt), lte(blogPosts.publishedAt, new Date())))
      .orderBy(asc(blogPosts.sortOrder), desc(blogPosts.publishedAt));
  } catch {
    return [];
  }
});

export const getPublishedPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), isNotNull(blogPosts.publishedAt), lte(blogPosts.publishedAt, new Date())))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
});

export const getAllPostsForPanel = cache(async (): Promise<BlogPost[]> => {
  const db = getDb();
  return db
    .select()
    .from(blogPosts)
    .orderBy(asc(blogPosts.sortOrder), desc(blogPosts.createdAt));
});

export const getPostForPanel = cache(async (id: number): Promise<BlogPost | null> => {
  const db = getDb();
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return row ?? null;
});
