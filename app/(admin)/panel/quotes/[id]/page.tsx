import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, Phone, Globe, MapPin, Package, Hash, Building2, ShoppingCart } from "lucide-react";

import { PageHeader } from "@/components/panel/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuote } from "@/lib/quotes";
import { markQuoteRead } from "@/lib/actions-quotes";
import { QUOTE_TYPE_LABELS } from "@/lib/quote-status";
import { StatusPicker } from "./status-picker";
import { NotesSection } from "./notes-section";
import { ReadToggle } from "./read-toggle";
import { DeleteQuoteButton } from "../delete-button";

export const metadata = { title: "Teklif — Panel" };

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) notFound();

  const quote = await getQuote(id);
  if (!quote) notFound();

  if (!quote.isRead) {
    await markQuoteRead(id);
  }

  const category = quote.customCategory || quote.categoryLabel;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={quote.name}
        description={`${QUOTE_TYPE_LABELS[quote.type]} · ${formatDateTime(quote.createdAt)}`}
        backHref="/panel/quotes"
        actions={
          <div className="flex items-center gap-2">
            <ReadToggle id={quote.id} isRead={quote.isRead} />
            <DeleteQuoteButton id={quote.id} name={quote.name} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {quote.items && quote.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-accent-500" />
                  Seçilen Ürünler
                  <span className="text-xs font-normal text-slate-500">
                    ({quote.items.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {quote.items.map((item, i) => {
                    const detailHref =
                      item.categorySlug && item.slug
                        ? `/${quote.locale}/urunler/${item.categorySlug}/${item.slug}`
                        : undefined;
                    const inner = (
                      <div className="flex gap-3 items-start p-3 rounded-lg border border-slate-200 hover:border-brand-300 transition">
                        <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-100">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-[10px] text-slate-400 font-mono">
                              {item.code}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.categoryName && (
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-accent-600">
                              {item.categoryName}
                            </div>
                          )}
                          <div className="text-sm font-medium text-slate-950 truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.code}</div>
                          {item.quantity && (
                            <div className="mt-1.5 inline-flex items-center gap-1 text-xs bg-slate-100 rounded px-2 py-0.5 text-slate-700">
                              <Hash className="w-3 h-3" />
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                    return (
                      <li key={`${item.code}-${i}`}>
                        {detailHref ? (
                          <Link href={detailHref} target="_blank" className="block">
                            {inner}
                          </Link>
                        ) : (
                          inner
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Mesaj</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {quote.message}
              </div>
            </CardContent>
          </Card>

          <NotesSection id={quote.id} notes={quote.notes ?? []} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Durum</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusPicker id={quote.id} current={quote.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İletişim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row icon={Mail} label="E-posta">
                <Link
                  href={`mailto:${quote.email}`}
                  className="text-brand-800 hover:text-accent-600 break-all"
                >
                  {quote.email}
                </Link>
              </Row>
              {quote.phone && (
                <Row icon={Phone} label="Telefon">
                  <Link
                    href={`tel:${quote.phone}`}
                    className="text-brand-800 hover:text-accent-600"
                  >
                    {quote.phone}
                  </Link>
                </Row>
              )}
              {quote.company && (
                <Row icon={Building2} label="Firma">
                  <span className="text-brand-800">{quote.company}</span>
                </Row>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Talep</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {category && (
                <Row icon={Package} label="Kategori">
                  <span className="text-brand-800">{category}</span>
                </Row>
              )}
              {quote.quantity && (
                <Row icon={Hash} label="Miktar">
                  <span className="text-brand-800">{quote.quantity}</span>
                </Row>
              )}
              <Row icon={Globe} label="Dil">
                <span className="text-brand-800 uppercase">{quote.locale}</span>
              </Row>
              {quote.ip && (
                <Row icon={MapPin} label="IP">
                  <span className="font-mono text-xs text-slate-600">{quote.ip}</span>
                </Row>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
          {label}
        </div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
