import { JsonLd } from "./JsonLd";
import { siteConfig, type Locale } from "@/lib/site";
import { stripHtml } from "@/lib/sanitize";
import type { Category, Product } from "@/lib/products";

type Props = {
  locale: Locale;
  product: Product;
  category: Category;
};

export function ProductJsonLd({ locale, product, category }: Props) {
  const gallery = product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];
  const url = `${siteConfig.url}/${locale}/urunler/${category.slug}/${product.slug}`;
  const description = stripHtml(product.description[locale]).slice(0, 500);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    sku: product.code,
    mpn: product.code,
    url,
    category: category.name[locale],
    brand: { "@type": "Brand", name: siteConfig.name },
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
  if (description) data.description = description;
  if (gallery.length > 0) data.image = gallery;

  return <JsonLd data={data} />;
}
