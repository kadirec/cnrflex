import { PageHeader } from "@/components/panel/page-header";
import { CustomerForm } from "@/components/panel/customer-form";
import { customersHref, EMPTY_CUSTOMER, sideLabels } from "@/lib/customer-calc";

export const metadata = { title: "Yeni Cari — Panel" };

export default async function NewCustomerPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind: k } = await searchParams;
  const kind = k === "supplier" ? "supplier" : "customer";
  const L = sideLabels(kind);
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={L.newCustomer}
        description={kind === "supplier" ? "Tedarikçi / hizmet aldığımız firma" : "Müşteri firma"}
        backHref={customersHref(kind, "list")}
      />
      <CustomerForm initial={{ ...EMPTY_CUSTOMER, kind }} />
    </div>
  );
}
