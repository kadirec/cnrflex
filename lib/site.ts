export const siteConfig = {
  name: "CNR Seal",
  url: "https://cnrseal.com",
  description: {
    tr: "PVC, TPE ve TPU bazlı fitil ve plastik profil tedariğinde modern çözüm ortağınız.",
    en: "Modern supply solutions: PVC, TPE and TPU based seal and plastic profile portfolio.",
  },
} as const;

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";
