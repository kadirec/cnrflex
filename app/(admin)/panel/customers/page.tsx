import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SaleStatusBadge } from "@/components/panel/sale-status-badge";
import { PaymentDialog } from "@/components/panel/payment-dialog";
import { cn } from "@/lib/utils";
import {
  countCustomers,
  countSalesAndPayments,
  listAllPayments,
  listAllSales,
  listCustomerOptions,
  listCustomers,
} from "@/lib/customers";
import {
  formatDateTr,
  formatMoney,
  formatSaleNo,
  isSaleStatus,
  PAYMENT_METHOD_LABELS,
  SALE_STATUSES,
  SALE_STATUS_LABELS,
  SALE_STATUS_STYLES,
} from "@/lib/customer-calc";
import { CustomerTabs, type CustomerView } from "./customer-tabs";

export const metadata = { title: "Cariler — Panel" };

type Search = { view?: string; q?: string; status?: string; debt?: string };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const view: CustomerView = sp.view === "sales" || sp.view === "payments" ? sp.view : "list";
  const q = sp.q?.trim() || undefined;

  const [customerCount, other] = await Promise.all([countCustomers(), countSalesAndPayments()]);
  const counts = { list: customerCount, sales: other.sales, payments: other.payments };

  if (view === "sales") {
    const status = sp.status && isSaleStatus(sp.status) ? sp.status : undefined;
    return <SalesView q={q} status={status} counts={counts} />;
  }
  if (view === "payments") return <PaymentsView q={q} counts={counts} />;

  const onlyDebtors = sp.debt === "1";
  const rows = await listCustomers({ q, onlyDebtors });
  const totalBalance = rows.reduce((s, r) => s + r.balance, 0);
  const totalPending = rows.reduce((s, r) => s + r.pendingOrdersTotal, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Cariler"
        description={`Satış carileri, bakiyeleri ve hesap hareketleri · ${rows.length} cari${q || onlyDebtors ? " (filtrelenmiş)" : ""}`}
        actions={
          <Link href="/panel/customers/new" className={buttonVariants({ size: "lg" })}>
            <Plus /> Yeni Cari
          </Link>
        }
      />
      <div className="mb-4 space-y-3">
        <CustomerTabs view="list" counts={counts} defaultQuery={q} extraParams={{ debt: sp.debt }} />
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip href="/panel/customers" active={!onlyDebtors} label="Tümü" />
          <FilterChip href="/panel/customers?debt=1" active={onlyDebtors} label="Borcu olanlar" />
          <div className="ml-auto flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5">
              Toplam bakiye: <strong className="tabular-nums">{formatMoney(totalBalance)}</strong>
            </span>
            {totalPending > 0 && (
              <span className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5">
                Bekleyen sipariş: <strong className="tabular-nums">{formatMoney(totalPending)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty>
          {q || onlyDebtors ? (
            "Sonuç bulunamadı."
          ) : (
            <>
              Henüz cari yok.{" "}
              <Link href="/panel/customers/new" className="text-brand-900 font-medium underline">
                İlk cariyi ekleyin
              </Link>
            </>
          )}
        </Empty>
      ) : (
        <Table
          minWidth={900}
          cols="grid-cols-[1fr_200px_130px_130px_130px_140px_100px]"
          head={["Cari", "Yetkili / Telefon", "Satış", "Tahsilat", "Bekleyen Sipariş", "Bakiye", "Son İşlem"]}
          alignRight={[2, 3, 4, 5]}
        >
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/panel/customers/${r.id}`}
              className="grid grid-cols-[1fr_200px_130px_130px_130px_140px_100px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-900">{r.name}</div>
                <div className="text-xs text-slate-500 truncate">
                  {[r.code, r.city].filter(Boolean).join(" · ") || "—"}
                </div>
              </div>
              <div className="min-w-0 text-xs text-slate-600">
                {r.contacts[0] ? (
                  <>
                    <div className="truncate">{r.contacts[0].name || "—"}</div>
                    <div className="truncate text-slate-500">{r.contacts[0].phone}</div>
                  </>
                ) : (
                  "—"
                )}
              </div>
              <Money value={r.salesTotal - r.returnsTotal} />
              <Money value={r.paymentsTotal} />
              <Money value={r.pendingOrdersTotal} muted />
              <BalanceCell value={r.balance} />
              <div className="text-xs text-slate-600">{r.lastActivity ? formatDateTr(r.lastActivity) : "—"}</div>
            </Link>
          ))}
        </Table>
      )}
    </div>
  );
}

async function SalesView({
  q,
  status,
  counts,
}: {
  q?: string;
  status?: (typeof SALE_STATUSES)[number];
  counts: Record<CustomerView, number>;
}) {
  const rows = await listAllSales({ q, status });
  const total = rows.reduce((s, r) => s + (r.kind === "return" ? -r.total : r.total), 0);
  const base = (s?: string) => `/panel/customers?view=sales${s ? `&status=${s}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Satışlar"
        description={`Tüm carilere ait satış, sipariş ve iade kayıtları · ${rows.length} kayıt`}
      />
      <div className="mb-4 space-y-3">
        <CustomerTabs view="sales" counts={counts} defaultQuery={q} extraParams={{ status }} />
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip href={base()} active={!status} label="Tümü" />
          {SALE_STATUSES.map((s) => (
            <FilterChip key={s} href={base(s)} active={status === s} label={SALE_STATUS_LABELS[s]} activeClass={SALE_STATUS_STYLES[s]} />
          ))}
          <span className="ml-auto rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs">
            Listelenen toplam: <strong className="tabular-nums">{formatMoney(total)}</strong>
          </span>
        </div>
      </div>
      {rows.length === 0 ? (
        <Empty>Kayıt bulunamadı. Satışlar cari detay sayfasından eklenir.</Empty>
      ) : (
        <Table
          minWidth={900}
          cols="grid-cols-[130px_1fr_1fr_200px_140px_100px]"
          head={["Belge No", "Cari", "Kalemler", "Durum", "Tutar", "Tarih"]}
          alignRight={[4]}
        >
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/panel/customers/${r.customerId}/sales/${r.id}`}
              className="grid grid-cols-[130px_1fr_1fr_200px_140px_100px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
            >
              <div className="text-xs font-mono text-slate-600">{formatSaleNo(r.id, r.saleDate)}</div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-900">{r.customerName}</div>
                {r.customerCode && <div className="text-xs text-slate-500 truncate">{r.customerCode}</div>}
              </div>
              <div className="min-w-0 text-xs text-slate-600 truncate">
                {r.items.map((it) => it.code || it.name).join(", ")}
              </div>
              <SaleStatusBadge status={r.status} kind={r.kind} />
              <Money value={r.kind === "return" ? -r.total : r.total} />
              <div className="text-xs text-slate-600">{formatDateTr(r.saleDate)}</div>
            </Link>
          ))}
        </Table>
      )}
    </div>
  );
}

async function PaymentsView({ q, counts }: { q?: string; counts: Record<CustomerView, number> }) {
  const [rows, options] = await Promise.all([listAllPayments({ q }), listCustomerOptions()]);
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Ödemeler"
        description={`Carilerden alınan tahsilatlar · ${rows.length} kayıt`}
        actions={options.length > 0 && <PaymentDialog customers={options} />}
      />
      <div className="mb-4 space-y-3">
        <CustomerTabs view="payments" counts={counts} defaultQuery={q} />
        <div className="flex justify-end">
          <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs">
            Listelenen toplam: <strong className="tabular-nums">{formatMoney(total)}</strong>
          </span>
        </div>
      </div>
      {rows.length === 0 ? (
        <Empty>Kayıt bulunamadı.</Empty>
      ) : (
        <Table
          minWidth={860}
          cols="grid-cols-[100px_1fr_150px_1fr_140px]"
          head={["Tarih", "Cari", "Ödeme Şekli", "Açıklama", "Tutar"]}
          alignRight={[4]}
        >
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/panel/customers/${r.customerId}`}
              className="grid grid-cols-[100px_1fr_150px_1fr_140px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
            >
              <div className="text-xs text-slate-600">{formatDateTr(r.paymentDate)}</div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-900">{r.customerName}</div>
                {r.customerCode && <div className="text-xs text-slate-500 truncate">{r.customerCode}</div>}
              </div>
              <div className="text-xs text-slate-700">
                {PAYMENT_METHOD_LABELS[r.method]}
                {r.dueDate && <div className="text-slate-500">Vade {formatDateTr(r.dueDate)}</div>}
              </div>
              <div className="min-w-0 text-xs text-slate-600 truncate">
                {[r.documentNo, r.description].filter(Boolean).join(" · ") || "—"}
              </div>
              <div className="text-right text-sm font-semibold tabular-nums text-emerald-700">{formatMoney(r.amount)}</div>
            </Link>
          ))}
        </Table>
      )}
    </div>
  );
}

function Table({
  cols,
  head,
  alignRight,
  minWidth,
  children,
}: {
  cols: string;
  head: string[];
  alignRight: number[];
  minWidth: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
      <div style={{ minWidth }}>
        <div
          className={cn(
            "grid gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider",
            cols,
          )}
        >
          {head.map((h, i) => (
            <div key={h} className={alignRight.includes(i) ? "text-right" : undefined}>
              {h}
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="py-16 text-center text-slate-500">{children}</CardContent>
    </Card>
  );
}

function FilterChip({
  href,
  active,
  label,
  activeClass,
}: {
  href: string;
  active: boolean;
  label: string;
  activeClass?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? activeClass
            ? cn(activeClass, "ring-2 ring-offset-1 ring-current")
            : "border-brand-900 bg-brand-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
      )}
    >
      {label}
    </Link>
  );
}

function Money({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className={cn("text-right text-sm tabular-nums", muted ? "text-slate-500" : "text-slate-800")}>
      {value ? formatMoney(value) : "—"}
    </div>
  );
}

function BalanceCell({ value }: { value: number }) {
  if (Math.abs(value) < 0.01) return <div className="text-right text-sm text-slate-400">Kapalı</div>;
  return (
    <div className="text-right">
      <div className={cn("text-sm font-semibold tabular-nums", value > 0 ? "text-red-700" : "text-emerald-700")}>
        {formatMoney(Math.abs(value))}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{value > 0 ? "Borç" : "Alacak"}</div>
    </div>
  );
}
