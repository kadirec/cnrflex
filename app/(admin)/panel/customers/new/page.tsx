import { PageHeader } from "@/components/panel/page-header";
import { CustomerForm } from "@/components/panel/customer-form";
import { EMPTY_CUSTOMER } from "@/lib/customer-calc";

export const metadata = { title: "Yeni Cari — Panel" };

export default function NewCustomerPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Yeni Cari" description="Satış carisi ekleyin" backHref="/panel/customers" />
      <CustomerForm initial={EMPTY_CUSTOMER} />
    </div>
  );
}
