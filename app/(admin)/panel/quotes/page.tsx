import Link from "next/link";
import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/components/panel/quote-status-badge";
import { QuoteFilters } from "./filters";
import { DeleteQuoteButton } from "./delete-button";
import { listQuotes, countByStatus, countByGroup, isQuoteGroup, type QuoteGroup } from "@/lib/quotes";
import { countOffers, listOffers, offersBySourceQuote } from "@/lib/offers";
import { formatOfferNo } from "@/lib/offer-calc";
import { OffersList } from "./offers/offers-list";
import { buttonVariants } from "@/components/ui/button";
import { Plus, Settings2, FileText, FileCheck2 } from "lucide-react";
import { isQuoteStatus, QUOTE_TYPE_LABELS } from "@/lib/quote-status";
import type { QuoteStatus } from "@/lib/db";

export const metadata = { title: "Teklifler — Panel" };

type Search = { status?: string; unread?: string; q?: string; group?: string };

const GROUP_META: Record<QuoteGroup, { title: string; description: string }> = {
  list: {
    title: "Teklif Listesi",
    description: "Katalog üzerinden gelen teklif ve iletişim talepleri",
  },
  custom: {
    title: "Özel Üretim Talebi",
    description: "Kendi ürünüm hakkında formundan gelen özel üretim talepleri",
  },
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function QuotesListPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  if (sp.group === "offers") return <OffersTab q={sp.q?.trim() || undefined} />;

  const group: QuoteGroup = sp.group && isQuoteGroup(sp.group) ? sp.group : "list";
  const statusFilter: QuoteStatus | undefined =
    sp.status && isQuoteStatus(sp.status) ? sp.status : undefined;
  const onlyUnread = sp.unread === "1";
  const q = sp.q?.trim() || undefined;

  const [rows, counts, groupCounts, offerCount] = await Promise.all([
    listQuotes({ group, status: statusFilter, onlyUnread, q }),
    countByStatus(group),
    countByGroup(),
    countOffers(),
  ]);

  const linked = await offersBySourceQuote(rows.map((r) => r.id));
  const meta = GROUP_META[group];

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={meta.title}
        description={`${meta.description} · ${rows.length} kayıt${statusFilter || onlyUnread || q ? " (filtrelenmiş)" : ""}`}
      />

      <div className="mb-4">
        <QuoteFilters
          group={group}
          groupCounts={{ ...groupCounts, offers: offerCount }}
          defaultStatus={statusFilter}
          defaultUnread={onlyUnread}
          defaultQuery={q}
          counts={counts}
        />
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-500">
            Sonuç bulunamadı.
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[24px_1fr_130px_120px_150px_90px_170px_48px] gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Gönderen</div>
            <div>Kategori / Miktar</div>
            <div>Durum</div>
            <div>Tarih</div>
            <div>Tür</div>
            <div>Teklif</div>
            <div className="text-right">Sil</div>
          </div>
          {rows.map((r) => {
            const dot = r.isRead ? "bg-slate-300" : "bg-sky-500";
            return (
              <div
                key={r.id}
                className="grid grid-cols-[24px_1fr_130px_120px_150px_90px_170px_48px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
              >
                <div className="flex items-center">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${dot}`}
                    aria-label={r.isRead ? "Okundu" : "Okunmadı"}
                  />
                </div>
                <Link
                  href={`/panel/quotes/${r.id}`}
                  className="min-w-0 block hover:text-brand-900"
                >
                  <div className={`truncate ${r.isRead ? "font-medium text-slate-800" : "font-semibold text-slate-950"}`}>
                    {r.name}
                    {r.company && <span className="text-slate-500 font-normal"> · {r.company}</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {r.email}
                    {r.phone && <span> · {r.phone}</span>}
                  </div>
                </Link>
                <div className="text-xs text-slate-600 truncate">
                  {r.items && r.items.length > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200 px-2 py-0.5 font-medium">
                      {r.items.length} ürün
                    </span>
                  ) : (
                    r.customCategory || r.categoryLabel || "—"
                  )}
                  {r.quantity && <div className="text-slate-400 mt-0.5">{r.quantity}</div>}
                </div>
                <div>
                  <QuoteStatusBadge status={r.status} />
                </div>
                <div className="text-xs text-slate-600">{formatDate(r.createdAt)}</div>
                <div className="text-xs text-slate-500">{QUOTE_TYPE_LABELS[r.type]}</div>
                <div>
                  <ConvertCell quoteId={r.id} type={r.type} offers={linked.get(r.id) ?? []} />
                </div>
                <div className="text-right">
                  <DeleteQuoteButton id={r.id} name={r.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function OffersTab({ q }: { q?: string }) {
  const [rows, groupCounts, counts, offerCount] = await Promise.all([
    listOffers({ q }),
    countByGroup(),
    countByStatus("list"),
    countOffers(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Verilen Teklifler"
        description={`Panelden hazırlanan fiyat teklifleri · ${rows.length} kayıt${q ? " (filtrelenmiş)" : ""}`}
        actions={
          <>
            <Link href="/panel/quotes/offers/settings" className={buttonVariants({ variant: "outline", size: "lg" })}>
              <Settings2 /> Teklif Ayarları
            </Link>
            <Link href="/panel/quotes/offers/new" className={buttonVariants({ size: "lg" })}>
              <Plus /> Yeni Teklif
            </Link>
          </>
        }
      />
      <div className="mb-4">
        <QuoteFilters
          group="offers"
          groupCounts={{ ...groupCounts, offers: offerCount }}
          defaultQuery={q}
          counts={counts}
        />
      </div>
      <OffersList rows={rows} />
    </div>
  );
}

function ConvertCell({
  quoteId,
  type,
  offers,
}: {
  quoteId: number;
  type: string;
  offers: { id: number; offerDate: string }[];
}) {
  if (offers.length > 0) {
    const latest = offers[0];
    return (
      <Link
        href={`/panel/quotes/offers/${latest.id}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
        title={offers.length > 1 ? `${offers.length} teklif hazırlandı` : "Teklifi aç"}
      >
        <FileCheck2 className="w-3.5 h-3.5" />
        {formatOfferNo(latest.id, latest.offerDate)}
        {offers.length > 1 && <span className="opacity-70">+{offers.length - 1}</span>}
      </Link>
    );
  }
  if (type === "contact") return <span className="text-xs text-slate-300">—</span>;
  return (
    <Link
      href={`/panel/quotes/offers/new?from=${quoteId}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-brand-900 hover:border-brand-900 hover:bg-brand-50"
    >
      <FileText className="w-3.5 h-3.5" />
      Teklife Dönüştür
    </Link>
  );
}
