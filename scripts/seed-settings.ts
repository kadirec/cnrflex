import { getDb, siteSettings } from "@/lib/db";
import { eq } from "drizzle-orm";

const SEO_DEFAULTS = {
  defaultMetaTitleTr:
    "CNR SEAL — Teknik Fitil ve Ekstrüzyon Profilleri Üreticisi",
  defaultMetaTitleEn:
    "CNR SEAL — Technical Seals & Extrusion Profiles Manufacturer",
  defaultMetaDescriptionTr:
    "PVC, TPE ve TPU bazlı teknik fitil, conta ve ekstrüzyon profilleri üretimi. Özel profil geliştirme, kalıp tasarımı ve güvenilir tedarik çözümleri.",
  defaultMetaDescriptionEn:
    "PVC, TPE and TPU based technical seals, gaskets and extrusion profiles. Custom profile development, mold design and reliable supply solutions.",
} as const;

async function main() {
  const db = getDb();
  const [existing] = await db.select().from(siteSettings).limit(1);

  const patch: Record<string, string> = {};
  for (const [key, value] of Object.entries(SEO_DEFAULTS)) {
    const current = existing?.[key as keyof typeof existing];
    if (typeof current !== "string" || current.length === 0) {
      patch[key] = value;
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log("SEO alanları zaten dolu — değişiklik yapılmadı.");
    return;
  }

  const withStamp = { ...patch, updatedAt: new Date() };

  if (existing) {
    await db.update(siteSettings).set(withStamp).where(eq(siteSettings.id, existing.id));
    console.log("Boş SEO alanları güncellendi:", Object.keys(patch));
  } else {
    await db.insert(siteSettings).values(withStamp);
    console.log("site_settings satırı oluşturuldu:", Object.keys(patch));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
