import { defaultLocale, siteConfig, type Locale } from "@/lib/site";

type Alternates = {
  canonical: string;
  languages: Record<string, string>;
};

export function buildAlternates(locale: Locale, path: string): Alternates {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      tr: `/tr${clean}`,
      en: `/en${clean}`,
      "x-default": `/${defaultLocale}${clean}`,
    },
  };
}

export function canonicalUrl(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}/${locale}${clean}`;
}
