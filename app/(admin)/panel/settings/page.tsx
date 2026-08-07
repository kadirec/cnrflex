import { PageHeader } from "@/components/panel/page-header";
import { SettingsForm } from "@/components/panel/settings-form";
import { getRawSettings } from "@/lib/settings";

export const metadata = { title: "Ayarlar — CNR Seal Panel" };

export default async function SettingsPage() {
  const settings = await getRawSettings();

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Site Ayarları"
        description="İletişim bilgileri, SEO varsayılanları ve analytics / pixel entegrasyonları."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
