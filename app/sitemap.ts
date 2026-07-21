import type { MetadataRoute } from "next";
import { getAllCategories } from "@/lib/products";
import { getAllPosts } from "@/content/blog";
import { siteConfig, locales } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/kurumsal/hakkimizda",
  "/kurumsal/vizyon-misyon",
  "/kurumsal/kalite",
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
  const categories = await getAllCategories();

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

  for (const post of getAllPosts()) {
    entries.push({
      url: `${base}/tr/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
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
