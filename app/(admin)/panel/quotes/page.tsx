import Link from "next/link";
import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/components/panel/quote-status-badge";
import { QuoteFilters } from "./filters";
import { DeleteQuoteButton } from "./delete-button";
import { listQuotes, countByStatus } from "@/lib/quotes";
import { QUOTE_STATUS_LABELS, isQuoteStatus, QUOTE_TYPE_LABELS } from "@/lib/quote-status";
import type { QuoteStatus } from "@/lib/db";

export const metadata = { title: "Teklifler — Panel" };

type Search = { status?: string; unread?: string; q?: string };

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
  const statusFilter: QuoteStatus | undefined =
    sp.status && isQuoteStatus(sp.status) ? sp.status : undefined;
  const onlyUnread = sp.unread === "1";
  const q = sp.q?.trim() || undefined;

  const [rows, counts] = await Promise.all([
    listQuotes({ status: statusFilter, onlyUnread, q }),
    countByStatus(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Teklifler"
        description={`Toplam ${rows.length} kayıt${statusFilter || onlyUnread || q ? " (filtrelenmiş)" : ""}`}
      />

      <div className="mb-4">
        <QuoteFilters
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
          <div className="grid grid-cols-[24px_1fr_180px_140px_160px_120px_60px] gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Gönderen</div>
            <div>Kategori / Miktar</div>
            <div>Durum</div>
            <div>Tarih</div>
            <div>Tür</div>
            <div className="text-right">Sil</div>
          </div>
          {rows.map((r) => {
            const dot = r.isRead ? "bg-slate-300" : "bg-sky-500";
            return (
              <div
                key={r.id}
                className="grid grid-cols-[24px_1fr_180px_140px_160px_120px_60px] gap-3 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
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
