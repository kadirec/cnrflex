import { JsonLd } from "./JsonLd";
import { siteConfig } from "@/lib/site";

export type BreadcrumbItem = { name: string; url: string };

type Props = { items: BreadcrumbItem[] };

export function BreadcrumbJsonLd({ items }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
  return <JsonLd data={data} />;
}
