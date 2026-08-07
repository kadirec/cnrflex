import type { BlogCategory } from "@/lib/db";

export const BLOG_CATEGORIES: Array<{
  slug: BlogCategory;
  label: { tr: string; en: string };
}> = [
  { slug: "malzeme-rehberleri", label: { tr: "Malzeme Rehberleri", en: "Material Guides" } },
  { slug: "uygulama-rehberleri", label: { tr: "Uygulama Rehberleri", en: "Application Guides" } },
  { slug: "uretim-teknolojileri", label: { tr: "Üretim Teknolojileri", en: "Production Technologies" } },
  { slug: "satin-alma-rehberleri", label: { tr: "Satın Alma Rehberleri", en: "Purchasing Guides" } },
];

export function getCategoryLabel(slug: BlogCategory | string, locale: "tr" | "en"): string {
  const found = BLOG_CATEGORIES.find((c) => c.slug === slug);
  return found ? found.label[locale] : slug;
}
