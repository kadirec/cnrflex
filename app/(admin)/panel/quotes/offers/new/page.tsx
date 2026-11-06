import { PageHeader } from "@/components/panel/page-header";
import { OfferForm } from "@/components/panel/offer-form";
import { buildOfferDraft, listOfferProducts } from "@/lib/offers";

export const metadata = { title: "Yeni Teklif — Panel" };

export default async function NewOfferPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const fromId = from && /^\d+$/.test(from) ? Number(from) : undefined;
  const [draft, products] = await Promise.all([buildOfferDraft(fromId), listOfferProducts()]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Yeni Teklif"
        description={
          draft.sourceQuoteId
            ? `#${draft.sourceQuoteId} numaralı talepten oluşturuluyor`
            : "Müşteri için ürün seçip fiyat teklifi hazırlayın"
        }
        backHref="/panel/quotes?group=offers"
      />
      <OfferForm initial={draft} products={products} />
    </div>
  );
}
