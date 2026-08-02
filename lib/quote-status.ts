import type { QuoteStatus, QuoteType } from "@/lib/db";

export const QUOTE_STATUSES: QuoteStatus[] = [
  "new",
  "contacted",
  "in_progress",
  "won",
  "lost",
  "spam",
];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  new: "Yeni",
  contacted: "İletişim kuruldu",
  in_progress: "Devam ediyor",
  won: "Kazanıldı",
  lost: "Kaybedildi",
  spam: "Spam",
};

export const QUOTE_STATUS_STYLES: Record<QuoteStatus, string> = {
  new: "bg-sky-100 text-sky-800 border-sky-200",
  contacted: "bg-violet-100 text-violet-800 border-violet-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-slate-200 text-slate-700 border-slate-300",
  spam: "bg-red-100 text-red-800 border-red-200",
};

export const QUOTE_TYPE_LABELS: Record<QuoteType, string> = {
  quote: "Teklif",
  contact: "İletişim",
  custom: "Özel Ürün",
};

export function isQuoteStatus(v: string): v is QuoteStatus {
  return (QUOTE_STATUSES as readonly string[]).includes(v);
}
