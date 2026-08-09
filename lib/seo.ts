import { defaultLocale, localePath, siteConfig, type Locale } from "@/lib/site";

type Alternates = {
  canonical: string;
  languages: Record<string, string>;
};

export function buildAlternates(locale: Locale, path: string): Alternates {
  return {
    canonical: localePath(locale, path),
    languages: {
      tr: localePath("tr", path),
      en: localePath("en", path),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

export function canonicalUrl(locale: Locale, path: string): string {
  return `${siteConfig.url}${localePath(locale, path)}`;
}
