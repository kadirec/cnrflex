"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import "@/lib/zod-tr";
import { getSession } from "@/lib/auth";
import { getDb, siteSettings } from "@/lib/db";
import { eq } from "drizzle-orm";

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null));

const optionalText = (max = 1000) =>
  z
    .union([z.string().max(max), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null));

const settingsSchema = z.object({
  contactEmail: optionalText(160),
  contactPhone: optionalText(60),
  contactWhatsapp: optionalText(60),
  addressTr: optionalText(500),
  addressEn: optionalText(500),
  workingHoursTr: optionalText(200),
  workingHoursEn: optionalText(200),
  mapEmbedUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  defaultMetaTitleTr: optionalText(200),
  defaultMetaTitleEn: optionalText(200),
  defaultMetaDescriptionTr: optionalText(500),
  defaultMetaDescriptionEn: optionalText(500),
  defaultOgImageUrl: optionalUrl,
  gaMeasurementId: optionalText(60),
  gtmContainerId: optionalText(60),
  metaPixelId: optionalText(60),
  headSnippet: optionalText(20000),
  bodySnippet: optionalText(20000),
});

export type SettingsFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseFormData(fd: FormData) {
  const get = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    contactEmail: get("contactEmail"),
    contactPhone: get("contactPhone"),
    contactWhatsapp: get("contactWhatsapp"),
    addressTr: get("addressTr"),
    addressEn: get("addressEn"),
    workingHoursTr: get("workingHoursTr"),
    workingHoursEn: get("workingHoursEn"),
    mapEmbedUrl: get("mapEmbedUrl"),
    instagramUrl: get("instagramUrl"),
    facebookUrl: get("facebookUrl"),
    linkedinUrl: get("linkedinUrl"),
    youtubeUrl: get("youtubeUrl"),
    defaultMetaTitleTr: get("defaultMetaTitleTr"),
    defaultMetaTitleEn: get("defaultMetaTitleEn"),
    defaultMetaDescriptionTr: get("defaultMetaDescriptionTr"),
    defaultMetaDescriptionEn: get("defaultMetaDescriptionEn"),
    defaultOgImageUrl: get("defaultOgImageUrl"),
    gaMeasurementId: get("gaMeasurementId"),
    gtmContainerId: get("gtmContainerId"),
    metaPixelId: get("metaPixelId"),
    headSnippet: get("headSnippet"),
    bodySnippet: get("bodySnippet"),
  };
}

export async function updateSettingsAction(
  _prev: SettingsFormState,
  fd: FormData,
): Promise<SettingsFormState> {
  const session = await getSession();
  if (!session.userId) return { ok: false, error: "Yetkisiz" };

  const parsed = settingsSchema.safeParse(parseFormData(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Formda hatalar var", fieldErrors };
  }

  const db = getDb();
  const values = { ...parsed.data, updatedAt: new Date() };

  try {
    const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    if (existing) {
      await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values(values);
    }
  } catch {
    return { ok: false, error: "Kayıt sırasında hata oluştu" };
  }

  revalidatePath("/", "layout");
  revalidatePath("/panel/settings");
  return { ok: true };
}
