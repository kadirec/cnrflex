import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Phone, MapPin, Mail, ShoppingCart, StickyNote } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PaymentDialog } from "@/components/panel/payment-dialog";
import { CustomerDeleteButton } from "@/components/panel/customer-delete-button";
import { cn } from "@/lib/utils";
import { getCustomer, getCustomerAccount } from "@/lib/customers";
import {
  buildLedger,
  formatDateTr,
  formatMoney,
  formatSaleNo,
  sideLabels,
  type LedgerRow,
  type SideLabels,
} from "@/lib/customer-calc";
import { customersHref } from "../customer-tabs";
import { PrintButton } from "./print-button";

export const metadata = { title: "Cari — Panel" };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const [customer, account] = await Promise.all([getCustomer(id), getCustomerAccount(id)]);
  if (!customer) notFound();

  const { summary, sales } = account;
  const L = sideLabels(customer.kind);
  const backHref = customersHref(customer.kind, "list");
  const ledger = buildLedger(sales, account.payments);
  const notesBySale = new Map(sales.filter((s) => s.notes).map((s) => [s.id, s.notes!]));

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

        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hesap Ekstresi</CardTitle>
            <PrintButton />
          </CardHeader>
          <CardContent>
            {ledger.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500 border border-dashed rounded-lg">
                Henüz hareket yok. {L.doc}/sipariş veya ödeme ekleyin.
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[860px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-slate-500 text-left border-b border-slate-200">
                      <th className="px-2 py-2 w-24">Tarih</th>
                      <th className="px-2 py-2">Ürün Kodu / Açıklama</th>
                      <th className="px-2 py-2 w-24 text-right">Miktar</th>
                      <th className="px-2 py-2 w-24 text-right">Birim Fiyat</th>
                      <th className="px-2 py-2 w-28 text-right">{L.debitCol}</th>
                      <th className="px-2 py-2 w-28 text-right">{L.creditCol}</th>
                      <th className="px-2 py-2 w-32 text-right">Bakiye</th>
                      <th className="px-2 py-2 w-20 print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((r, i) => {
                      const next = ledger[i + 1];
                      const lastOfSale = r.saleId && (!next || next.saleId !== r.saleId);
                      return (
                        <LedgerLine
                          key={r.key}
                          row={r}
                          customerId={id}
                          labels={L}
                          side={customer.kind}
                          note={lastOfSale ? notesBySale.get(r.saleId!) : undefined}
                        />
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 font-semibold">
                      <td className="px-2 py-2" colSpan={4}>
                        Toplam
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">
                        {formatMoney(ledger.filter((r) => r.counts).reduce((s, r) => s + r.debit, 0))}
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">
                        {formatMoney(ledger.filter((r) => r.counts).reduce((s, r) => s + r.credit, 0))}
                      </td>
                      <td className={cn("px-2 py-2 text-right tabular-nums", summary.balance > 0.009 ? "text-red-700" : "text-emerald-700")}>
                        {formatMoney(summary.balance)}
                      </td>
                      <td className="print:hidden"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ROW_TONE: Record<LedgerRow["type"], string> = {
  sale: "",
  return: "bg-rose-50/50",
  order: "bg-amber-50/60 text-slate-500",
  cancelled: "text-slate-400 line-through",
  payment: "bg-emerald-50/40",
};

function LedgerLine({
  row: r,
  customerId,
  labels: L,
  side,
  note,
}: {
  row: LedgerRow;
  customerId: number;
  labels: SideLabels;
  side: "customer" | "supplier";
  note?: string;
}) {
  return (
    <>
      <tr className={cn("border-b border-slate-100", ROW_TONE[r.type])}>
        <td className="px-2 py-2 text-xs text-slate-600 whitespace-nowrap">{r.first ? formatDateTr(r.date) : ""}</td>
        <td className="px-2 py-2">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium", r.type === "payment" ? "text-emerald-800" : "text-slate-900")}>{r.title}</span>
            {r.first && r.type === "order" && <Tag className="border-amber-300 bg-amber-100 text-amber-800">{L.status.order}</Tag>}
            {r.first && r.type === "return" && <Tag className="border-rose-200 bg-rose-100 text-rose-700">İade</Tag>}
            {r.first && r.type === "cancelled" && <Tag className="border-slate-300 bg-slate-100 text-slate-600 no-underline">İptal</Tag>}
          </div>
          {r.description && <div className="text-xs text-slate-500">{r.description}</div>}
        </td>
        <td className="px-2 py-2 text-right tabular-nums text-xs">{r.quantityLabel}</td>
        <td className="px-2 py-2 text-right tabular-nums text-xs">{r.unitPriceLabel}</td>
        <td className="px-2 py-2 text-right tabular-nums">{r.debit ? formatMoney(r.debit) : ""}</td>
        <td className="px-2 py-2 text-right tabular-nums">{r.credit ? formatMoney(r.credit) : ""}</td>
        <td className={cn("px-2 py-2 text-right tabular-nums font-medium", r.balance > 0.009 ? "text-red-700" : "text-emerald-700")}>
          {r.counts ? formatMoney(r.balance) : <span className="text-[10px] text-slate-400 no-underline">dahil değil</span>}
        </td>
        <td className="px-1 py-1 print:hidden">
          {r.first && (
            <div className="flex items-center justify-end">
              {r.saleId ? (
                <>
                  <Link
                    href={`/panel/customers/${customerId}/sales/${r.saleId}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                    title={formatSaleNo(r.saleId, r.date)}
                    aria-label="Düzenle"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <CustomerDeleteButton target="sale" id={r.saleId} name={formatSaleNo(r.saleId, r.date)} />
                </>
              ) : r.payment ? (
                <>
                  <PaymentDialog payment={r.payment} side={side} />
                  <CustomerDeleteButton target="payment" id={r.payment.id} name={`${formatDateTr(r.date)} tarihli`} />
                </>
              ) : null}
            </div>
          )}
        </td>
      </tr>
      {note && (
        <tr className="border-b border-slate-100">
          <td></td>
          <td colSpan={7} className="px-2 pb-2 text-xs italic text-amber-800">
            Not: {note}
          </td>
        </tr>
      )}
    </>
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
