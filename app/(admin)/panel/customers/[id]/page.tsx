import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Phone, MapPin, Mail, ShoppingCart, StickyNote, ChevronRight, Package, Wallet, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PaymentDialog } from "@/components/panel/payment-dialog";
import { CustomerDeleteButton } from "@/components/panel/customer-delete-button";
import { SaleStatusSelect } from "@/components/panel/sale-status-select";
import { cn } from "@/lib/utils";
import { getCustomer, getCustomerAccount } from "@/lib/customers";
import {
  buildLedger,
  formatDateTr,
  formatNumber,
  PAYMENT_METHOD_LABELS,
  summarizeItems,
  formatMoney,
  formatSaleNo,
  sideLabels,
  customersHref,
  type LedgerRow,
} from "@/lib/customer-calc";
import type { CustomerKind, CustomerPayment, CustomerSale } from "@/lib/db/schema";
import { PrintButton } from "./print-button";

export const metadata = { title: "Cari — Panel" };

type Tab = "orders" | "payments" | "ledger";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id: idRaw } = await params;
  const { tab: tabRaw } = await searchParams;
  const tab: Tab = tabRaw === "payments" || tabRaw === "ledger" ? tabRaw : "orders";
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const [customer, account] = await Promise.all([getCustomer(id), getCustomerAccount(id)]);
  if (!customer) notFound();

  const { summary, sales } = account;
  const L = sideLabels(customer.kind);
  const backHref = customersHref(customer.kind, "list");
  const payments = account.payments;
  const tabHref = (t: Tab) => (t === "orders" ? `/panel/customers/${id}` : `/panel/customers/${id}?tab=${t}`);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title={customer.name}
        description={[`${L.side} carisi`, customer.code, customer.city].filter(Boolean).join(" · ")}
        backHref={backHref}
        actions={
          <>
            <Link href={`/panel/customers/${id}/edit`} className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Pencil /> Düzenle
            </Link>
            <PaymentDialog customerId={id} side={customer.kind} />
            <Link href={`/panel/customers/${id}/sales/new`} className={buttonVariants({ size: "lg" })}>
              <ShoppingCart /> {L.newDoc}
            </Link>
            <CustomerDeleteButton target="customer" id={id} name={customer.name} redirectTo={backHref} />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label={L.totalDocs} value={summary.salesTotal} />
        <Stat label="İade" value={summary.returnsTotal} />
        <Stat label={L.paid} value={summary.paymentsTotal} tone="green" />
        <Stat label="Bekleyen Sipariş" value={summary.pendingOrdersTotal} tone="amber" hint="Bakiyeye dahil değil" />
        <Stat
          label={summary.balance > 0.009 ? `Bakiye (${L.balancePos})` : summary.balance < -0.009 ? `Bakiye (${L.balanceNeg})` : "Bakiye"}
          value={Math.abs(summary.balance)}
          tone={summary.balance > 0.009 ? "red" : "green"}
          strong
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="xl:col-span-1 h-fit print:hidden">
          <CardHeader>
            <CardTitle>Cari Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {customer.contacts.length === 0 && <div className="text-slate-400">Yetkili girilmemiş</div>}
            {customer.contacts.map((c, i) => (
              <div key={i}>
                <div className="font-medium text-slate-900">{c.name || "—"}</div>
                {c.phone && (
                  <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-brand-900">
                    <Phone className="w-3.5 h-3.5" /> {c.phone}
                  </a>
                )}
              </div>
            ))}
            {customer.email && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5" /> {customer.email}
              </div>
            )}
            {(customer.address || customer.city) && (
              <div className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {[customer.address, customer.city].filter(Boolean).join(", ")}
              </div>
            )}
            {(customer.taxOffice || customer.taxNumber) && (
              <div className="text-xs text-slate-500">
                VD: {customer.taxOffice || "—"} · VN: {customer.taxNumber || "—"}
              </div>
            )}
            {customer.notes && (
              <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 whitespace-pre-line">
                <StickyNote className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {customer.notes}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="xl:col-span-3 space-y-4">
          <div role="tablist" className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 print:hidden">
            <TabLink href={tabHref("orders")} active={tab === "orders"} icon={Package} label={`${L.docs} / Siparişler`} count={sales.length} />
            <TabLink href={tabHref("payments")} active={tab === "payments"} icon={Wallet} label={L.paymentsTab} count={payments.length} />
            <TabLink href={tabHref("ledger")} active={tab === "ledger"} icon={ScrollText} label="Hesap Ekstresi" />
          </div>

          {tab === "orders" && <OrdersCard sales={[...sales].reverse()} customerId={id} side={customer.kind} />}
          {tab === "payments" && <PaymentsCard payments={[...payments].reverse()} side={customer.kind} customerId={id} />}
          {tab === "ledger" && <LedgerCard rows={buildLedger(sales, payments)} side={customer.kind} balance={summary.balance} />}
        </div>
      </div>
    </div>
  );
}

function TabLink({
  href,
  active,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      scroll={false}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
        active ? "bg-white text-brand-950 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
            active ? "bg-brand-950 text-white" : "bg-slate-200 text-slate-700",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

function EmptyBox({ children }: { children: React.ReactNode }) {
  return <div className="py-10 text-center text-sm text-slate-500 border border-dashed rounded-lg">{children}</div>;
}

const ORDER_GRID = "grid grid-cols-[20px_120px_90px_1fr_190px_130px_72px] gap-3 items-center";

function OrdersCard({ sales, customerId, side }: { sales: CustomerSale[]; customerId: number; side: CustomerKind }) {
  const L = sideLabels(side);
  const signed = (s: CustomerSale) => (s.kind === "return" ? -s.total : s.total);
  const active = sales.filter((s) => s.status !== "cancelled");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {L.docs} / Siparişler <span className="text-sm font-normal text-slate-500">· {sales.length} belge</span>
        </CardTitle>
        <Link href={`/panel/customers/${customerId}/sales/new`} className={buttonVariants({ size: "sm" })}>
          <ShoppingCart /> {L.newDoc}
        </Link>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <EmptyBox>Henüz kayıt yok.</EmptyBox>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <div className="min-w-[820px] px-2">
              <div className={cn(ORDER_GRID, "py-2 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold")}>
                <div></div>
                <div>Belge No</div>
                <div>Tarih</div>
                <div>Kalemler</div>
                <div>Durum</div>
                <div className="text-right">Tutar</div>
                <div></div>
              </div>
              {sales.map((s) => (
                <details key={s.id} className="group border-b border-slate-100 last:border-b-0">
                  <summary className={cn(ORDER_GRID, "py-2.5 cursor-pointer list-none hover:bg-slate-50/70 [&::-webkit-details-marker]:hidden", s.status === "cancelled" && "opacity-60")}>
                    <ChevronRight className="w-4 h-4 text-slate-400 transition group-open:rotate-90" />
                    <div className="text-xs font-mono text-slate-700">{formatSaleNo(s.id, s.saleDate)}</div>
                    <div className="text-xs text-slate-600">{formatDateTr(s.saleDate)}</div>
                    <div className="min-w-0">
                      <div className="truncate text-sm text-slate-800">
                        {s.kind === "return" && <span className="mr-1.5 rounded-full border border-rose-200 bg-rose-50 px-1.5 text-[10px] font-semibold text-rose-700">İADE</span>}
                        {summarizeItems(s.items)}
                      </div>
                      {s.notes && <div className="truncate text-xs italic text-amber-700">{s.notes}</div>}
                    </div>
                    <div>
                      <SaleStatusSelect id={s.id} status={s.status} side={side} />
                    </div>
                    <div className={cn("text-right text-sm font-semibold tabular-nums", s.kind === "return" ? "text-rose-700" : "text-slate-900")}>
                      {formatMoney(signed(s))}
                    </div>
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/panel/customers/${customerId}/sales/${s.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                        title="Düzenle"
                        aria-label="Düzenle"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <CustomerDeleteButton target="sale" id={s.id} name={formatSaleNo(s.id, s.saleDate)} />
                    </div>
                  </summary>
                  <div className="ml-8 mr-2 mb-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-slate-500 text-left">
                          <th className="px-3 py-1.5 w-44">Ürün Kodu</th>
                          <th className="px-3 py-1.5">Açıklama</th>
                          <th className="px-3 py-1.5 text-right w-28">Miktar</th>
                          <th className="px-3 py-1.5 text-right w-28">Birim Fiyat</th>
                          <th className="px-3 py-1.5 text-right w-32">Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.items.map((it, i) => (
                          <tr key={i} className="border-t border-slate-200/70">
                            <td className="px-3 py-1.5 font-mono text-slate-600">{it.code || "—"}</td>
                            <td className="px-3 py-1.5 text-slate-800">{it.name}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">
                              {formatNumber(it.quantity)} {it.unit}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(it.unitPrice)}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(it.quantity * it.unitPrice)}</td>
                          </tr>
                        ))}
                        {s.vatTotal > 0 && (
                          <tr className="border-t border-slate-200/70 text-slate-600">
                            <td className="px-3 py-1.5" colSpan={4}>
                              Ara toplam {formatMoney(s.subtotal)} · KDV %{s.vatRate}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{formatMoney(s.vatTotal)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
              <div className={cn(ORDER_GRID, "pt-3 text-sm font-semibold")}>
                <div></div>
                <div className="col-span-4 text-slate-600">Toplam (iptaller hariç)</div>
                <div className="text-right tabular-nums">{formatMoney(active.reduce((a, s) => a + signed(s), 0))}</div>
                <div></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const PAY_GRID = "grid grid-cols-[100px_150px_1fr_140px_72px] gap-3 items-center";

function PaymentsCard({ payments, side, customerId }: { payments: CustomerPayment[]; side: CustomerKind; customerId: number }) {
  const L = sideLabels(side);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {L.paymentsTab} <span className="text-sm font-normal text-slate-500">· {payments.length} hareket</span>
        </CardTitle>
        <PaymentDialog customerId={customerId} side={side} />
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyBox>Henüz ödeme kaydı yok.</EmptyBox>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <div className="min-w-[680px] px-2">
              <div className={cn(PAY_GRID, "py-2 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold")}>
                <div>Tarih</div>
                <div>Ödeme Şekli</div>
                <div>Belge No / Açıklama</div>
                <div className="text-right">Tutar</div>
                <div></div>
              </div>
              {payments.map((p) => (
                <div key={p.id} className={cn(PAY_GRID, "py-2.5 border-b border-slate-100 last:border-b-0")}>
                  <div className="text-xs text-slate-600">{formatDateTr(p.paymentDate)}</div>
                  <div className="text-sm text-slate-800">
                    {PAYMENT_METHOD_LABELS[p.method]}
                    {p.dueDate && <div className="text-xs text-amber-700">Vade {formatDateTr(p.dueDate)}</div>}
                  </div>
                  <div className="min-w-0 text-xs text-slate-600">
                    {p.documentNo && <div className="font-mono text-slate-700">{p.documentNo}</div>}
                    <div className="truncate">{p.description || (p.documentNo ? "" : "—")}</div>
                  </div>
                  <div className="text-right text-sm font-semibold tabular-nums text-emerald-700">{formatMoney(p.amount)}</div>
                  <div className="flex items-center justify-end">
                    <PaymentDialog payment={p} side={side} />
                    <CustomerDeleteButton target="payment" id={p.id} name={`${formatDateTr(p.paymentDate)} tarihli`} />
                  </div>
                </div>
              ))}
              <div className={cn(PAY_GRID, "pt-3 text-sm font-semibold")}>
                <div className="col-span-3 text-slate-600">Toplam</div>
                <div className="text-right tabular-nums text-emerald-700">
                  {formatMoney(payments.reduce((a, p) => a + p.amount, 0))}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const ROW_TONE: Record<LedgerRow["type"], string> = {
  sale: "",
  return: "bg-rose-50/50",
  order: "bg-amber-50/60 text-slate-500",
  cancelled: "text-slate-400 line-through",
  payment: "bg-emerald-50/40",
};

function LedgerCard({ rows, side, balance }: { rows: LedgerRow[]; side: CustomerKind; balance: number }) {
  const L = sideLabels(side);
  const counted = rows.filter((r) => r.counts);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hesap Ekstresi</CardTitle>
        <PrintButton />
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyBox>Henüz hareket yok.</EmptyBox>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 text-left border-b border-slate-200">
                  <th className="px-2 py-2 w-24">Tarih</th>
                  <th className="px-2 py-2 w-32">Belge</th>
                  <th className="px-2 py-2">Açıklama</th>
                  <th className="px-2 py-2 w-28 text-right">{L.debitCol}</th>
                  <th className="px-2 py-2 w-28 text-right">{L.creditCol}</th>
                  <th className="px-2 py-2 w-32 text-right">Bakiye</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className={cn("border-b border-slate-100", ROW_TONE[r.type])}>
                    <td className="px-2 py-2 text-xs text-slate-600 whitespace-nowrap">{formatDateTr(r.date)}</td>
                    <td className={cn("px-2 py-2 text-xs font-mono", r.type === "payment" ? "text-emerald-800 font-semibold" : "text-slate-700")}>
                      {r.title}
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-600">
                      {r.type === "order" && <Tag className="mr-1.5 border-amber-300 bg-amber-100 text-amber-800">{L.status.order}</Tag>}
                      {r.type === "return" && <Tag className="mr-1.5 border-rose-200 bg-rose-100 text-rose-700">İade</Tag>}
                      {r.type === "cancelled" && <Tag className="mr-1.5 border-slate-300 bg-slate-100 text-slate-600">İptal</Tag>}
                      {r.description}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.debit ? formatMoney(r.debit) : ""}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{r.credit ? formatMoney(r.credit) : ""}</td>
                    <td className={cn("px-2 py-2 text-right tabular-nums font-medium", r.balance > 0.009 ? "text-red-700" : "text-emerald-700")}>
                      {r.counts ? formatMoney(r.balance) : <span className="text-[10px] text-slate-400">dahil değil</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-semibold">
                  <td className="px-2 py-2" colSpan={3}>
                    Toplam
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">{formatMoney(counted.reduce((s, r) => s + r.debit, 0))}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{formatMoney(counted.reduce((s, r) => s + r.credit, 0))}</td>
                  <td className={cn("px-2 py-2 text-right tabular-nums", balance > 0.009 ? "text-red-700" : "text-emerald-700")}>
                    {formatMoney(balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Tag({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex rounded-full border px-1.5 py-0 text-[10px] font-semibold", className)}>{children}</span>
  );
}

function Stat({
  label,
  value,
  tone,
  hint,
  strong,
}: {
  label: string;
  value: number;
  tone?: "green" | "red" | "amber";
  hint?: string;
  strong?: boolean;
}) {
  const color =
    tone === "green" ? "text-emerald-700" : tone === "red" ? "text-red-700" : tone === "amber" ? "text-amber-700" : "text-slate-900";
  return (
    <div className={cn("rounded-xl border bg-white p-4", strong ? "border-slate-300 ring-1 ring-slate-200" : "border-slate-200")}>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={cn("mt-1 tabular-nums font-bold", strong ? "text-xl" : "text-lg", color)}>{formatMoney(value)}</div>
      {hint && <div className="text-[10px] text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}
