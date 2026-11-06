import type {
  CustomerPayment,
  CustomerSale,
  PaymentMethod,
  SaleItem,
  SaleKind,
  SaleStatus,
  SaleUnit,
} from "@/lib/db/schema";
import { round2 } from "@/lib/offer-calc";

export { formatMoney, formatNumber, formatOfferDate as formatDateTr, todayIso } from "@/lib/offer-calc";

export const SALE_UNITS: SaleUnit[] = ["MT", "ADET", "KG", "TOP"];

export const SALE_STATUSES: SaleStatus[] = ["order", "delivered", "cancelled"];
export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  order: "Sipariş (gönderilmedi)",
  delivered: "Teslim edildi",
  cancelled: "İptal",
};
export const SALE_STATUS_STYLES: Record<SaleStatus, string> = {
  order: "bg-amber-100 text-amber-800 border-amber-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-slate-200 text-slate-600 border-slate-300",
};

export const SALE_KIND_LABELS: Record<SaleKind, string> = { sale: "Satış", return: "İade" };

export const PAYMENT_METHODS: PaymentMethod[] = ["transfer", "cash", "card", "check", "note", "other"];
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  transfer: "Banka Havalesi",
  cash: "Nakit",
  card: "Kredi Kartı",
  check: "Çek",
  note: "Senet",
  other: "Diğer",
};
/** Vade tarihi istenen ödeme şekilleri */
export const DEFERRED_METHODS: PaymentMethod[] = ["check", "note"];

export function isSaleStatus(v: string): v is SaleStatus {
  return (SALE_STATUSES as string[]).includes(v);
}

export type SaleTotals = { subtotal: number; vatTotal: number; total: number };

export function computeSale(items: SaleItem[], vatRate: number): SaleTotals {
  const subtotal = round2(items.reduce((s, it) => s + (it.quantity || 0) * (it.unitPrice || 0), 0));
  const vatTotal = round2(subtotal * ((vatRate || 0) / 100));
  return { subtotal, vatTotal, total: round2(subtotal + vatTotal) };
}

/** Satışın cari bakiyesine etkisi: teslim edilen satış borç (+), iade alacak (−), sipariş/iptal 0. */
export function saleBalanceEffect(s: Pick<CustomerSale, "kind" | "status" | "total">): number {
  if (s.status !== "delivered") return 0;
  return s.kind === "return" ? -s.total : s.total;
}

export type LedgerRow = {
  key: string;
  date: string;
  type: "sale" | "return" | "order" | "cancelled" | "payment";
  title: string;
  description: string;
  quantityLabel: string;
  unitPriceLabel: string;
  debit: number;
  credit: number;
  /** Bu satır bakiyeye dahil mi */
  counts: boolean;
  balance: number;
  saleId?: number;
  payment?: CustomerPayment;
  /** Aynı belgenin ilk satırı mı (düzenleme/silme butonu burada) */
  first: boolean;
};

/** Excel'deki cari ekstresi: tarih sırasına göre satış kalemleri ve ödemeler, yürüyen bakiye ile. */
export function buildLedger(sales: CustomerSale[], payments: CustomerPayment[]): LedgerRow[] {
  type Ev = { date: string; created: number; rows: Omit<LedgerRow, "balance">[] };
  const events: Ev[] = [];

  for (const s of sales) {
    const type: LedgerRow["type"] =
      s.status === "cancelled" ? "cancelled" : s.status === "order" ? "order" : s.kind === "return" ? "return" : "sale";
    const counts = s.status === "delivered";
    const sign = s.kind === "return" ? -1 : 1;
    const rows: Omit<LedgerRow, "balance">[] = s.items.map((it, i) => {
      const amount = round2((it.quantity || 0) * (it.unitPrice || 0));
      return {
        key: `s${s.id}-${i}`,
        date: s.saleDate,
        type,
        title: it.code || it.name,
        description: it.code ? it.name : "",
        quantityLabel: `${new Intl.NumberFormat("tr-TR").format(it.quantity)} ${it.unit}`,
        unitPriceLabel: new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(it.unitPrice),
        debit: sign > 0 ? amount : 0,
        credit: sign < 0 ? amount : 0,
        counts,
        saleId: s.id,
        first: i === 0,
      };
    });
    if (s.vatTotal > 0) {
      rows.push({
        key: `s${s.id}-vat`,
        date: s.saleDate,
        type,
        title: `KDV %${s.vatRate}`,
        description: "",
        quantityLabel: "",
        unitPriceLabel: "",
        debit: sign > 0 ? s.vatTotal : 0,
        credit: sign < 0 ? s.vatTotal : 0,
        counts,
        saleId: s.id,
        first: rows.length === 0,
      });
    }
    if (rows.length > 0) events.push({ date: s.saleDate, created: s.createdAt.getTime(), rows });
  }

  for (const p of payments) {
    const desc = [PAYMENT_METHOD_LABELS[p.method], p.documentNo, p.dueDate ? `Vade ${fmtDate(p.dueDate)}` : null, p.description]
      .filter(Boolean)
      .join(" · ");
    events.push({
      date: p.paymentDate,
      created: p.createdAt.getTime(),
      rows: [
        {
          key: `p${p.id}`,
          date: p.paymentDate,
          type: "payment",
          title: "ÖDEME",
          description: desc,
          quantityLabel: "",
          unitPriceLabel: "",
          debit: 0,
          credit: p.amount,
          counts: true,
          payment: p,
          first: true,
        },
      ],
    });
  }

  events.sort((a, b) => (a.date === b.date ? a.created - b.created : a.date < b.date ? -1 : 1));

  let balance = 0;
  const out: LedgerRow[] = [];
  for (const ev of events) {
    for (const r of ev.rows) {
      if (r.counts) balance = round2(balance + r.debit - r.credit);
      out.push({ ...r, balance });
    }
  }
  return out;
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function formatSaleNo(id: number, saleDate: string): string {
  return `STS-${saleDate.slice(0, 4)}-${String(id).padStart(4, "0")}`;
}

export type CustomerDraft = {
  kind: "customer" | "supplier";
  code: string;
  name: string;
  contacts: { name: string; phone: string }[];
  email: string;
  city: string;
  address: string;
  taxOffice: string;
  taxNumber: string;
  notes: string;
};

export const EMPTY_CUSTOMER: CustomerDraft = {
  kind: "customer",
  code: "",
  name: "",
  contacts: [],
  email: "",
  city: "",
  address: "",
  taxOffice: "",
  taxNumber: "",
  notes: "",
};

export function customerToDraft(c: {
  kind: "customer" | "supplier";
  code: string | null;
  name: string;
  contacts: { name: string; phone: string }[];
  email: string | null;
  city: string | null;
  address: string | null;
  taxOffice: string | null;
  taxNumber: string | null;
  notes: string | null;
}): CustomerDraft {
  return {
    kind: c.kind,
    code: c.code ?? "",
    name: c.name,
    contacts: c.contacts ?? [],
    email: c.email ?? "",
    city: c.city ?? "",
    address: c.address ?? "",
    taxOffice: c.taxOffice ?? "",
    taxNumber: c.taxNumber ?? "",
    notes: c.notes ?? "",
  };
}
