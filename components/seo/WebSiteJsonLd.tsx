import { JsonLd } from "./JsonLd";
import { siteConfig, type Locale } from "@/lib/site";

type Props = { locale: Locale };

export function WebSiteJsonLd({ locale }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
  };
  return <JsonLd data={data} />;
}
