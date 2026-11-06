import Link from "next/link";
import { FileDown, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Offer } from "@/lib/db";
import {
  computeOffer,
  DEFAULT_OFFER_SETTINGS,
  formatMoney,
  formatOfferDate,
  formatOfferNo,
} from "@/lib/offer-calc";
import { DeleteOfferButton } from "./delete-offer-button";

const GRID = "grid grid-cols-[120px_1fr_150px_90px_150px_110px_120px] gap-3";

export function OffersList({ rows }: { rows: Offer[] }) {
  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-slate-500">
          Henüz teklif yok.{" "}
          <Link href="/panel/quotes/offers/new" className="text-brand-900 font-medium underline">
            İlk teklifi oluşturun
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
      <div className="min-w-[900px]">
        <div
          className={`${GRID} px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider`}
        >
          <div>Teklif No</div>
          <div>Müşteri / Yetkili</div>
          <div>Telefon</div>
          <div>Ürün</div>
          <div className="text-right">Tutar (KDV Dahil)</div>
          <div>Tarih</div>
          <div className="text-right">İşlem</div>
        </div>
        {rows.map((r) => {
          const calc = computeOffer(r.items ?? [], { ...DEFAULT_OFFER_SETTINGS, ...r.settings });
          return (
            <div
              key={r.id}
              className={`${GRID} px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition`}
            >
              <Link href={`/panel/quotes/offers/${r.id}`} className="text-xs font-mono text-slate-600 hover:text-brand-900">
                {formatOfferNo(r.id, r.offerDate)}
              </Link>
              <Link href={`/panel/quotes/offers/${r.id}`} className="min-w-0 block hover:text-brand-900">
                <div className="truncate font-semibold text-slate-900">{r.customerName}</div>
                <div className="text-xs text-slate-500 truncate">
                  {r.contactPerson || "—"}
                  {r.email && <span> · {r.email}</span>}
                </div>
              </Link>
              <div className="text-sm text-slate-700 truncate">{r.phone || "—"}</div>
              <div>
                <span className="inline-flex items-center rounded-full bg-accent-50 text-accent-700 border border-accent-200 px-2 py-0.5 text-xs font-medium">
                  {r.items?.length ?? 0} ürün
                </span>
              </div>
              <div className="text-right text-sm font-semibold tabular-nums text-slate-900">
                {formatMoney(calc.cash.total)}
              </div>
              <div className="text-xs text-slate-600">{formatOfferDate(r.offerDate)}</div>
              <div className="flex items-center justify-end gap-1">
                <a
                  href={`/panel/quotes/offers/${r.id}/pdf`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                  title="PDF indir"
                  aria-label="PDF indir"
                >
                  <FileDown className="w-4 h-4" />
                </a>
                <Link
                  href={`/panel/quotes/offers/${r.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                  title="Düzenle"
                  aria-label="Düzenle"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteOfferButton id={r.id} name={r.customerName} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
