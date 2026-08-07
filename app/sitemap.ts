import type { MetadataRoute } from "next";
import { getAllCategoriesFlat } from "@/lib/products";
import { getPublishedPosts } from "@/lib/blog";
import { siteConfig, locales } from "@/lib/site";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const categories = await getAllCategoriesFlat();

  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({
      url: `${base}/tr${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
      },
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${base}/tr/urunler/${category.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/urunler/${category.slug}`]),
        ),
      },
    });

    for (const product of category.products) {
      entries.push({
        url: `${base}/tr/urunler/${category.slug}/${product.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}/urunler/${category.slug}/${product.slug}`]),
          ),
        },
      });
    }
  }

  const posts = await getPublishedPosts();
  for (const post of posts) {
    entries.push({
      url: `${base}/tr/blog/${post.slug}`,
      lastModified: post.publishedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/blog/${post.slug}`]),
        ),
      },
    });
  }

  return entries;
}
