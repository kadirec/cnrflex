import type { OfferInstallment, OfferItem, OfferSettings } from "@/lib/db/schema";

export const DEFAULT_OFFER_NOTES = [
  "Fiyatlarımıza KDV dahil değildir.",
  "Nakliye alıcıya aittir.",
  "Termin süresi sipariş miktarına göre belirlenmektedir.",
  "Fiyatlarımızda ani hammadde ve döviz kuru değişiklikleri durumunda revizyon yapma hakkımız saklıdır.",
  "Olası fiyat değişikliği durumunda sipariş öncesi müşteriye bilgilendirme yapılacaktır.",
].join("\n");

export const DEFAULT_OFFER_SETTINGS: OfferSettings = {
  vatRate: 20,
  showCard: true,
  installments: [
    { count: 2, rate: 6 },
    { count: 3, rate: 7.8 },
    { count: 4, rate: 10 },
  ],
  showDeferred: true,
  deferredLabel: "Senet",
  monthlyRate: 4,
  downPaymentRate: 20,
  termDays: [30, 60, 90, 120],
  transferDiscount: 3,
};

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function cardUnitPrice(item: OfferItem, inst: OfferInstallment): number {
  const manual = item.cardPrices?.[String(inst.count)];
  if (typeof manual === "number" && Number.isFinite(manual) && manual > 0) return manual;
  return round2(item.unitPrice * (1 + inst.rate / 100));
}

export type Totals = { subtotal: number; vat: number; total: number };

export type DeferredTerm = Totals & {
  days: number;
  /** Vade farkı yüzdesi */
  rate: number;
  downPayment: number;
  remaining: number;
};

export type OfferComputation = {
  cash: Totals;
  card: (Totals & { count: number })[];
  deferred: DeferredTerm[];
};

function withVat(subtotal: number, vatRate: number): Totals {
  const vat = subtotal * (vatRate / 100);
  return { subtotal, vat, total: subtotal + vat };
}

export function lineTotal(item: OfferItem, price = item.unitPrice): number {
  return (item.quantity || 0) * (price || 0);
}

export function computeOffer(items: OfferItem[], s: OfferSettings): OfferComputation {
  const base = items.reduce((sum, it) => sum + lineTotal(it), 0);

  const card = s.installments.map((inst) => {
    const subtotal = items.reduce((sum, it) => sum + lineTotal(it, cardUnitPrice(it, inst)), 0);
    return { count: inst.count, ...withVat(subtotal, s.vatRate) };
  });

  const deferred = s.termDays.map((days) => {
    const rate = s.monthlyRate * (days / 30);
    const t = withVat(base * (1 + rate / 100), s.vatRate);
    const downPayment = t.total * (s.downPaymentRate / 100);
    return { days, rate, ...t, downPayment, remaining: t.total - downPayment };
  });

  return { cash: withVat(base, s.vatRate), card, deferred };
}

const moneyFmt = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numFmt = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });
const pctFmt = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

export const formatMoney = (n: number) => moneyFmt.format(round2(n));
export const formatNumber = (n: number) => numFmt.format(n);
export const formatPercent = (n: number) => `${pctFmt.format(n)}%`;
export const formatRate = (n: number) => `${numFmt.format(n)}%`;

export function formatOfferNo(id: number, offerDate: string): string {
  return `TKF-${offerDate.slice(0, 4)}-${String(id).padStart(4, "0")}`;
}

export function formatOfferDate(offerDate: string): string {
  const [y, m, d] = offerDate.split("-");
  return `${d}.${m}.${y}`;
}

export function todayIso(): string {
  const now = new Date();
  const tz = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
  const mm = String(tz.getMonth() + 1).padStart(2, "0");
  const dd = String(tz.getDate()).padStart(2, "0");
  return `${tz.getFullYear()}-${mm}-${dd}`;
}
