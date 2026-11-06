import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { SaleForm } from "@/components/panel/sale-form";
import { CustomerDeleteButton } from "@/components/panel/customer-delete-button";
import { getCustomer, getSale } from "@/lib/customers";
import { listOfferProducts } from "@/lib/offers";
import { formatDateTr, formatSaleNo, SALE_KIND_LABELS } from "@/lib/customer-calc";

export const metadata = { title: "Satış — Panel" };

export default async function EditSalePage({ params }: { params: Promise<{ id: string; saleId: string }> }) {
  const { id: idRaw, saleId: saleRaw } = await params;
  const id = Number(idRaw);
  const saleId = Number(saleRaw);
  if (!Number.isInteger(id) || !Number.isInteger(saleId)) notFound();
  const [customer, sale, products] = await Promise.all([getCustomer(id), getSale(saleId), listOfferProducts()]);
  if (!customer || !sale || sale.customerId !== id) notFound();

  const no = formatSaleNo(sale.id, sale.saleDate);
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={`${no} · ${SALE_KIND_LABELS[sale.kind]}`}
        description={`${customer.name} · ${formatDateTr(sale.saleDate)}`}
        backHref={`/panel/customers/${id}`}
        actions={<CustomerDeleteButton target="sale" id={sale.id} name={no} redirectTo={`/panel/customers/${id}`} />}
      />
      <SaleForm
        key={sale.updatedAt.toISOString()}
        customerId={id}
        saleId={sale.id}
        products={products}
        initial={{
          saleDate: sale.saleDate,
          kind: sale.kind,
          status: sale.status,
          items: sale.items,
          vatRate: sale.vatRate,
          notes: sale.notes ?? "",
        }}
      />
    </div>
  );
}
