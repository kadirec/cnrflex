import { PageHeader } from "@/components/panel/page-header";
import { getOfferDefaults } from "@/lib/offers";
import { OfferDefaultsForm } from "./defaults-form";

export const metadata = { title: "Teklif Ayarları — Panel" };

export default async function OfferSettingsPage() {
  const defaults = await getOfferDefaults();
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Teklif Ayarları"
        description="Yeni tekliflerde varsayılan olarak kullanılacak kart taksit, senet/çek ve KDV oranları"
        backHref="/panel/quotes?group=offers"
      />
      <OfferDefaultsForm initial={defaults} />
    </div>
  );
}
