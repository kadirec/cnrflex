import "server-only";
import { cache } from "react";
import { getDb, siteSettings, type SiteSettings } from "@/lib/db";

export type ResolvedSettings = {
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  addressTr: string;
  addressEn: string;
  workingHoursTr: string;
  workingHoursEn: string;
  mapEmbedUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  defaultMetaTitleTr: string;
  defaultMetaTitleEn: string;
  defaultMetaDescriptionTr: string;
  defaultMetaDescriptionEn: string;
  defaultOgImageUrl: string;
  gaMeasurementId: string;
  gtmContainerId: string;
  metaPixelId: string;
  headSnippet: string;
  bodySnippet: string;
};

export const DEFAULT_SETTINGS: ResolvedSettings = {
  contactEmail: "info@cnrseal.com",
  contactPhone: "+90 542 610 65 77",
  contactWhatsapp: "905426106577",
  addressTr: "Yenibosna Merkez Mah. Sanayi Cad. No:92 Bahçelievler, İstanbul, Türkiye",
  addressEn: "Yenibosna Merkez Mah. Sanayi Cad. No:92 Bahçelievler, Istanbul, Türkiye",
  workingHoursTr: "Pazartesi - Cumartesi: 09:00 - 18:00",
  workingHoursEn: "Monday - Saturday: 09:00 - 18:00",
  mapEmbedUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  defaultMetaTitleTr: "",
  defaultMetaTitleEn: "",
  defaultMetaDescriptionTr: "",
  defaultMetaDescriptionEn: "",
  defaultOgImageUrl: "",
  gaMeasurementId: "",
  gtmContainerId: "",
  metaPixelId: "",
  headSnippet: "",
  bodySnippet: "",
};

function resolve(row: SiteSettings | undefined): ResolvedSettings {
  if (!row) return DEFAULT_SETTINGS;
  const merged: ResolvedSettings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof ResolvedSettings>) {
    const value = row[key as keyof SiteSettings];
    if (typeof value === "string" && value.length > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

export const getSiteSettings = cache(async (): Promise<ResolvedSettings> => {
  try {
    const db = getDb();
    const [row] = await db.select().from(siteSettings).limit(1);
    return resolve(row);
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export const getRawSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const db = getDb();
    const [row] = await db.select().from(siteSettings).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
});
