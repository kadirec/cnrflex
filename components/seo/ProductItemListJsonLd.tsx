import { JsonLd } from "./JsonLd";
import { siteConfig, type Locale } from "@/lib/site";
import type { Category } from "@/lib/products";

type Props = { locale: Locale; category: Category };

export function ProductItemListJsonLd({ locale, category }: Props) {
  if (category.products.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name[locale],
    itemListElement: category.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/${locale}/urunler/${category.slug}/${p.slug}`,
      name: p.name[locale],
    })),
  };
  return <JsonLd data={data} />;
}
