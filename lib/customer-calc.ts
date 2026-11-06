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
  /** Belge no (satış) veya "ÖDEME" */
  title: string;
  description: string;
  debit: number;
  credit: number;
  /** Bu satır bakiyeye dahil mi */
  counts: boolean;
  balance: number;
  saleId?: number;
  payment?: CustomerPayment;
};

/** Kalemlerin kısa özeti: "DÜZ DİKME FİTİLİ (200 MT), 120 LİK TAPA (2.400 ADET) +1 kalem" */
export function summarizeItems(items: SaleItem[], max = 2): string {
  const nf = new Intl.NumberFormat("tr-TR");
  const head = items.slice(0, max).map((it) => `${it.name || it.code} (${nf.format(it.quantity)} ${it.unit})`);
  const rest = items.length - max;
  return head.join(", ") + (rest > 0 ? ` +${rest} kalem` : "");
}

/** Cari ekstresi: belge bazında (satış/sipariş/iade ve ödemeler), tarih sırasıyla yürüyen bakiye. */
export function buildLedger(sales: CustomerSale[], payments: CustomerPayment[]): LedgerRow[] {
  type Ev = { created: number; row: Omit<LedgerRow, "balance"> };
  const events: Ev[] = [];

  for (const s of sales) {
    const type: LedgerRow["type"] =
      s.status === "cancelled" ? "cancelled" : s.status === "order" ? "order" : s.kind === "return" ? "return" : "sale";
    const isReturn = s.kind === "return";
    events.push({
      created: s.createdAt.getTime(),
      row: {
        key: `s${s.id}`,
        date: s.saleDate,
        type,
        title: formatSaleNo(s.id, s.saleDate),
        description: summarizeItems(s.items) + (s.vatTotal > 0 ? ` · KDV %${s.vatRate} dahil` : ""),
        debit: isReturn ? 0 : s.total,
        credit: isReturn ? s.total : 0,
        counts: s.status === "delivered",
        saleId: s.id,
      },
    });
  }

  for (const p of payments) {
    const desc = [PAYMENT_METHOD_LABELS[p.method], p.documentNo, p.dueDate ? `Vade ${fmtDate(p.dueDate)}` : null, p.description]
      .filter(Boolean)
      .join(" · ");
    events.push({
      created: p.createdAt.getTime(),
      row: {
        key: `p${p.id}`,
        date: p.paymentDate,
        type: "payment",
        title: "ÖDEME",
        description: desc,
        debit: 0,
        credit: p.amount,
        counts: true,
        payment: p,
      },
    });
  }

  events.sort((a, b) => (a.row.date === b.row.date ? a.created - b.created : a.row.date < b.row.date ? -1 : 1));

  let balance = 0;
  return events.map(({ row }) => {
    if (row.counts) balance = round2(balance + row.debit - row.credit);
    return { ...row, balance };
  });
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

export type SideLabels = {
  side: string;
  customers: string;
  customersDesc: string;
  docs: string;
  doc: string;
  newDoc: string;
  totalDocs: string;
  paid: string;
  paymentsTab: string;
  paymentsDesc: string;
  addPayment: string;
  paymentTitle: string;
  debitCol: string;
  creditCol: string;
  balancePos: string;
  balanceNeg: string;
  newCustomer: string;
  status: Record<SaleStatus, string>;
  orderHint: string;
};

const STATUS_SALE: Record<SaleStatus, string> = SALE_STATUS_LABELS;
const STATUS_PURCHASE: Record<SaleStatus, string> = {
  order: "Sipariş (teslim alınmadı)",
  delivered: "Teslim alındı",
  cancelled: "İptal",
};

export function sideLabels(kind: "customer" | "supplier"): SideLabels {
  if (kind === "supplier") {
    return {
      side: "Alış",
      customers: "Alış Carileri",
      customersDesc: "Tedarikçiler ve onlara olan borcumuz",
      docs: "Alışlar",
      doc: "Alış",
      newDoc: "Alış / Sipariş",
      totalDocs: "Toplam Alış",
      paid: "Ödenen",
      paymentsTab: "Ödemeler",
      paymentsDesc: "Tedarikçilere yaptığımız ödemeler",
      addPayment: "Ödeme Yap",
      paymentTitle: "Tedarikçiye Ödeme",
      debitCol: "Alış Tutarı",
      creditCol: "Ödenen",
      balancePos: "Borcumuz",
      balanceNeg: "Alacağımız",
      newCustomer: "Yeni Alış Carisi",
      status: STATUS_PURCHASE,
      orderHint:
        "Sipariş durumundaki alışlar ürün teslim alınana kadar borcumuza yansımaz. Teslim alındığında durumu \"Teslim alındı\" yapın.",
    };
  }
  return {
    side: "Satış",
    customers: "Satış Carileri",
    customersDesc: "Müşteriler, bakiyeleri ve hesap hareketleri",
    docs: "Satışlar",
    doc: "Satış",
    newDoc: "Satış / Sipariş",
    totalDocs: "Toplam Satış",
    paid: "Tahsilat",
    paymentsTab: "Tahsilatlar",
    paymentsDesc: "Carilerden alınan tahsilatlar",
    addPayment: "Tahsilat Ekle",
    paymentTitle: "Ödeme / Tahsilat Ekle",
    debitCol: "Borçlu",
    creditCol: "Alacaklı",
    balancePos: "Borç",
    balanceNeg: "Alacak",
    newCustomer: "Yeni Satış Carisi",
    status: STATUS_SALE,
    orderHint:
      "Sipariş durumundaki kayıtlar ürün gönderilene kadar bakiyeye yansımaz. Gönderildiğinde durumu \"Teslim edildi\" yapın.",
  };
}

export type CustomerView = "list" | "sales" | "payments";

/** Satış/alış ve görünüm için liste URL'i */
export function customersHref(kind: "customer" | "supplier", view: CustomerView, params: Record<string, string | undefined> = {}) {
  const sp = new URLSearchParams();
  if (kind === "supplier") sp.set("side", "alis");
  if (view !== "list") sp.set("view", view);
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const s = sp.toString();
  return s ? `/panel/customers?${s}` : "/panel/customers";
}
