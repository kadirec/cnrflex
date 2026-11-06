import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { SaleForm } from "@/components/panel/sale-form";
import { getCustomer } from "@/lib/customers";
import { listOfferProducts } from "@/lib/offers";
import { todayIso } from "@/lib/customer-calc";

export const metadata = { title: "Yeni Satış — Panel" };

export default async function NewSalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();
  const [customer, products] = await Promise.all([getCustomer(id), listOfferProducts()]);
  if (!customer) notFound();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Yeni Satış / Sipariş"
        description={customer.name}
        backHref={`/panel/customers/${id}`}
      />
      <SaleForm
        customerId={id}
        products={products}
        initial={{ saleDate: todayIso(), kind: "sale", status: "delivered", items: [], vatRate: 0, notes: "" }}
      />
    </div>
  );
}
