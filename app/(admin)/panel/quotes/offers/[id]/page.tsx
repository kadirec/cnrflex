import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { OfferForm } from "@/components/panel/offer-form";
import { getOffer, listOfferProducts, type OfferDraft } from "@/lib/offers";
import { DEFAULT_OFFER_SETTINGS, formatOfferNo, formatOfferDate } from "@/lib/offer-calc";
import { DeleteOfferButton } from "../delete-offer-button";

export const metadata = { title: "Teklif — Panel" };

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const [offer, products] = await Promise.all([getOffer(id), listOfferProducts()]);
  if (!offer) notFound();

  const initial: OfferDraft = {
    offerDate: offer.offerDate,
    customerName: offer.customerName,
    contactPerson: offer.contactPerson ?? "",
    phone: offer.phone ?? "",
    email: offer.email ?? "",
    address: offer.address ?? "",
    taxOffice: offer.taxOffice ?? "",
    taxNumber: offer.taxNumber ?? "",
    items: offer.items ?? [],
    settings: { ...DEFAULT_OFFER_SETTINGS, ...offer.settings },
    notes: offer.notes ?? "",
    sourceQuoteId: offer.sourceQuoteId,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={`${formatOfferNo(offer.id, offer.offerDate)} · ${offer.customerName}`}
        description={`Teklif tarihi ${formatOfferDate(offer.offerDate)}`}
        backHref="/panel/quotes?group=offers"
        actions={<DeleteOfferButton id={offer.id} name={offer.customerName} redirectTo="/panel/quotes?group=offers" />}
      />
      <OfferForm key={offer.updatedAt.toISOString()} offerId={offer.id} initial={initial} products={products} />
    </div>
  );
}
