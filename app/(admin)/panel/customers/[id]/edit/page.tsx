import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { CustomerForm } from "@/components/panel/customer-form";
import { getCustomer } from "@/lib/customers";
import { customerToDraft } from "@/lib/customer-calc";

export const metadata = { title: "Cari Düzenle — Panel" };

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title={`${customer.name} · Düzenle`} backHref={`/panel/customers/${id}`} />
      <CustomerForm key={customer.updatedAt.toISOString()} customerId={id} initial={customerToDraft(customer)} />
    </div>
  );
}
