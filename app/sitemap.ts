import type { MetadataRoute } from "next";
import { getAllCategoriesFlat } from "@/lib/products";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig, locales, localePath, defaultLocale } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/kurumsal/hakkimizda",
  "/kurumsal/vizyon-misyon",
  "/urunler",
  "/blog",
  "/teklif-al",
  "/iletisim",
  "/katalog",
  "/gizlilik-politikasi",
  "/kullanim-sartlari",
];

function languagesFor(path: string) {
  return Object.fromEntries(
    locales.map((l) => [l, `${siteConfig.url}${localePath(l, path)}`]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const [categories, posts] = await Promise.all([
    getAllCategoriesFlat(),
    getPublishedPosts(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      url: `${base}${localePath(defaultLocale, path)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: languagesFor(path) },
    });
  }

  for (const category of categories) {
    const catPath = `/urunler/${category.slug}`;
    const productLatest = category.products.reduce<Date>(
      (max, p) => (p.updatedAt > max ? p.updatedAt : max),
      category.updatedAt,
    );
    entries.push({
      url: `${base}${localePath(defaultLocale, catPath)}`,
      lastModified: productLatest,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor(catPath) },
    });

    for (const product of category.products) {
      const prodPath = `/urunler/${category.slug}/${product.slug}`;
      entries.push({
        url: `${base}${localePath(defaultLocale, prodPath)}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languagesFor(prodPath) },
      });
    }
  }

  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    const lastMod = post.updatedAt ?? post.publishedAt ?? now;
    entries.push({
      url: `${base}${localePath(defaultLocale, path)}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: languagesFor(path) },
    });
  }

  return entries;
}
