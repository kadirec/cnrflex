import { JsonLd } from "./JsonLd";
import { siteConfig, type Locale } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";

type Props = { locale: Locale };

export async function LocalBusinessJsonLd({ locale }: Props) {
  const settings = await getSiteSettings();
  const address = locale === "tr" ? settings.addressTr : settings.addressEn;

  const sameAs = [
    settings.instagramUrl,
    settings.facebookUrl,
    settings.linkedinUrl,
    settings.youtubeUrl,
  ].filter((u): u is string => Boolean(u && u.length > 0));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#localbusiness`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/logo.png`,
    logo: `${siteConfig.url}/logo.png`,
    telephone: settings.contactPhone,
    email: settings.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      availableLanguage: ["tr", "en"],
    },
  };
  if (sameAs.length > 0) data.sameAs = sameAs;

  return <JsonLd data={data} />;
}
