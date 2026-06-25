export const siteConfig = {
  name: "CNRFlexis",
  url: "https://cnrflexis.com",
  description: {
    tr: "PVC, TPE ve TPU bazlı fitil ve plastik profil tedariğinde modern çözüm ortağınız.",
    en: "Modern supply solutions: PVC, TPE and TPU based seal and plastic profile portfolio.",
  },
  contact: {
    email: "info@cnrflexis.com",
    phone: "+90 000 000 00 00",
    whatsapp: "905000000000",
    address: {
      tr: "İstanbul, Türkiye",
      en: "Istanbul, Turkey",
    },
  },
  social: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
    youtube: "#",
  },
} as const;

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";
