import { siteConfig, type Locale } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";

type Props = { locale: Locale };

export async function OrganizationJsonLd({ locale }: Props) {
  const settings = await getSiteSettings();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description[locale],
    email: settings.contactEmail,
    telephone: settings.contactPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "tr" ? settings.addressTr : settings.addressEn,
      addressCountry: "TR",
    },
    sameAs: [
      settings.instagramUrl,
      settings.facebookUrl,
      settings.linkedinUrl,
      settings.youtubeUrl,
    ].filter((u) => u && u.length > 0),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
