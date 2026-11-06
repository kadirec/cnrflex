"use client";

import { useMemo, useRef, useState, useTransition, useEffect } from "react";
import { OfferSettingsFields, DecimalInput, Field } from "@/components/panel/offer-settings-fields";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Trash2, Save, FileDown, PackagePlus, Settings2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { saveOffer } from "@/lib/actions-offers";
import type { OfferDraft, OfferProductOption } from "@/lib/offers";
import type { OfferItem } from "@/lib/db/schema";
import {
  cardUnitPrice,
  computeOffer,
  formatMoney,
  formatPercent,
  formatRate,
  lineTotal,
} from "@/lib/offer-calc";

type Props = {
  offerId?: number;
  initial: OfferDraft;
  products: OfferProductOption[];
};

export function OfferForm({ offerId, initial, products }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<OfferDraft>(initial);
  const [dirty, setDirty] = useState(false);

  const s = draft.settings;
  const calc = useMemo(() => computeOffer(draft.items, s), [draft.items, s]);

  const set = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };
  const updateItem = (i: number, patch: Partial<OfferItem>) =>
    set(
      "items",
      draft.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    );

  const addProduct = (p: OfferProductOption) =>
    set("items", [
      ...draft.items,
      {
        productId: p.id,
        code: p.code,
        name: p.name,
        image: p.image,
        quantity: 0,
        packageSize: p.rollLength,
        unitPrice: 0,
      },
    ]);

  const addCustomRow = () =>
    set("items", [...draft.items, { code: "", name: "", quantity: 0, unitPrice: 0, packageSize: null }]);

  const onSave = () => {
    startTransition(async () => {
      const res = await saveOffer(draft, offerId);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(offerId ? "Teklif güncellendi" : "Teklif kaydedildi");
      setDirty(false);
      if (!offerId) router.push(`/panel/quotes/offers/${res.id}`);
      else router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Müşteri / Firma *">
              <Input value={draft.customerName} onChange={(e) => set("customerName", e.target.value)} />
            </Field>
            <Field label="Yetkili Kişi (Ad Soyad)">
              <Input value={draft.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
            </Field>
            <Field label="Telefon">
              <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="E-posta">
              <Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Vergi Dairesi">
              <Input value={draft.taxOffice} onChange={(e) => set("taxOffice", e.target.value)} />
            </Field>
            <Field label="Vergi No">
              <Input value={draft.taxNumber} onChange={(e) => set("taxNumber", e.target.value)} />
            </Field>
            <Field label="Adres" className="sm:col-span-2">
              <Input value={draft.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teklif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Teklif Tarihi">
              <Input type="date" value={draft.offerDate} onChange={(e) => set("offerDate", e.target.value)} />
            </Field>
            <Field label="Notlar (her satır bir madde)">
              <Textarea rows={6} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle>Ürünler</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <ProductPicker products={products} onPick={addProduct} />
            <Button type="button" variant="outline" onClick={addCustomRow}>
              <PackagePlus /> Serbest Satır
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {draft.items.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 border border-dashed rounded-lg">
              Katalogdan ürün arayıp ekleyin.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-500 text-left">
                    <th className="px-2 py-2 w-14"></th>
                    <th className="px-2 py-2 w-40">Ürün Kodu</th>
                    <th className="px-2 py-2">Ürün Adı / Açıklama</th>
                    <th className="px-2 py-2 w-28">Sipariş (MT)</th>
                    <th className="px-2 py-2 w-24">Paket (MT)</th>
                    <th className="px-2 py-2 w-28">Birim Fiyat ₺</th>
                    {s.showCard &&
                      s.installments.map((inst) => (
                        <th key={inst.count} className="px-2 py-2 w-24">
                          K.K. {inst.count} Tk.
                        </th>
                      ))}
                    <th className="px-2 py-2 w-32 text-right">Tutar</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {draft.items.map((it, i) => (
                    <tr key={i} className="border-t border-slate-100 align-top">
                      <td className="px-2 py-2">
                        <div className="relative w-10 h-10 rounded bg-slate-100 overflow-hidden">
                          {it.image && <Image src={it.image} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <Input value={it.code} onChange={(e) => updateItem(i, { code: e.target.value })} />
                      </td>
                      <td className="px-2 py-2">
                        <Textarea
                          rows={2}
                          className="min-h-0 text-sm"
                          value={it.name}
                          onChange={(e) => updateItem(i, { name: e.target.value })}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <DecimalInput value={it.quantity} onChange={(v) => updateItem(i, { quantity: v ?? 0 })} />
                      </td>
                      <td className="px-2 py-2">
                        <DecimalInput
                          value={it.packageSize ?? null}
                          onChange={(v) => updateItem(i, { packageSize: v })}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <DecimalInput value={it.unitPrice} onChange={(v) => updateItem(i, { unitPrice: v ?? 0 })} />
                      </td>
                      {s.showCard &&
                        s.installments.map((inst) => {
                          const key = String(inst.count);
                          const manual = it.cardPrices?.[key];
                          return (
                            <td key={inst.count} className="px-2 py-2">
                              <DecimalInput
                                value={manual ?? null}
                                placeholder={cardUnitPrice({ ...it, cardPrices: undefined }, inst).toFixed(2).replace(".", ",")}
                                onChange={(v) => {
                                  const next = { ...(it.cardPrices ?? {}) };
                                  if (v == null || v <= 0) delete next[key];
                                  else next[key] = v;
                                  updateItem(i, { cardPrices: next });
                                }}
                              />
                            </td>
                          );
                        })}
                      <td className="px-2 py-2 text-right font-medium tabular-nums pt-4">
                        {formatMoney(lineTotal(it))}
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => set("items", draft.items.filter((_, idx) => idx !== i))}
                          className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                          aria-label="Satırı sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {s.showCard && (
                <p className="px-2 mt-2 text-xs text-slate-500">
                  Kart fiyat alanları boş bırakılırsa birim fiyata taksit oranı eklenerek hesaplanır (gri değer).
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ödeme Ayarları</h2>
          <p className="text-xs text-slate-500">
            Varsayılanlar Teklif Ayarları&apos;ndan gelir; burada yapılan değişiklik yalnızca bu teklifi etkiler.
          </p>
        </div>
        <a
          href="/panel/quotes/offers/settings"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-900"
        >
          <Settings2 className="w-3.5 h-3.5" /> Teklif Ayarları
        </a>
      </div>
      <OfferSettingsFields settings={s} onChange={(next) => set("settings", next)} />

      <Card>
        <CardHeader>
          <CardTitle>Hesap Özeti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SummaryTable
            title="Kredi Kartı"
            columns={["Birim Fiyat", ...(s.showCard ? calc.card.map((c) => `${c.count} Taksit K.K`) : [])]}
            rows={[
              ["Toplam (KDV Hariç)", [calc.cash.subtotal, ...(s.showCard ? calc.card.map((c) => c.subtotal) : [])].map(formatMoney)],
              [`KDV (%${s.vatRate})`, [calc.cash.vat, ...(s.showCard ? calc.card.map((c) => c.vat) : [])].map(formatMoney)],
              ["Genel Toplam", [calc.cash.total, ...(s.showCard ? calc.card.map((c) => c.total) : [])].map(formatMoney), true],
            ]}
          />
          {s.showDeferred && calc.deferred.length > 0 && (
            <SummaryTable
              title={`${s.deferredLabel} ile Ödeme`}
              columns={calc.deferred.map((_, i) => `${s.deferredLabel} Vadesi ${i + 1}`)}
              rows={[
                ["Vade (Gün)", calc.deferred.map((d) => `${d.days} gün`)],
                ["Vade Farkı", calc.deferred.map((d) => formatPercent(d.rate))],
                ["Toplam (KDV Hariç)", calc.deferred.map((d) => formatMoney(d.subtotal))],
                ["KDV", calc.deferred.map((d) => formatMoney(d.vat))],
                ["Genel Toplam", calc.deferred.map((d) => formatMoney(d.total)), true],
                [`Peşinat (${formatRate(s.downPaymentRate)})`, calc.deferred.map((d) => formatMoney(d.downPayment))],
                [`${s.deferredLabel} Yazılacak Tutar`, calc.deferred.map((d) => formatMoney(d.remaining)), true],
              ]}
            />
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 bg-white/90 backdrop-blur border-t border-slate-200 flex items-center justify-end gap-2">
        {offerId && (
          <a
            href={`/panel/quotes/offers/${offerId}/pdf?inline=1`}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              if (dirty) {
                e.preventDefault();
                toast.warning("Kaydedilmemiş değişiklikler var. Önizleme için önce kaydedin.");
              }
            }}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Eye /> Önizle
          </a>
        )}
        {offerId && (
          <a
            href={`/panel/quotes/offers/${offerId}/pdf`}
            onClick={(e) => {
              if (dirty) {
                e.preventDefault();
                toast.warning("Kaydedilmemiş değişiklikler var. PDF için önce kaydedin.");
              }
            }}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <FileDown /> PDF İndir
          </a>
        )}
        <Button type="button" size="lg" onClick={onSave} disabled={pending}>
          <Save /> {pending ? "Kaydediliyor…" : offerId ? "Kaydet" : "Teklifi Kaydet"}
        </Button>
      </div>
    </div>
  );
}

export function ProductPicker({
  products,
  onPick,
}: {
  products: OfferProductOption[];
  onPick: (p: OfferProductOption) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    const list = needle
      ? products.filter(
          (p) =>
            p.code.toLocaleLowerCase("tr").includes(needle) ||
            p.name.toLocaleLowerCase("tr").includes(needle) ||
            p.categoryName.toLocaleLowerCase("tr").includes(needle),
        )
      : products;
    return list.slice(0, 40);
  }, [q, products]);

  return (
    <div ref={boxRef} className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        placeholder="Ürün kodu veya adıyla ara…"
        className="pl-9"
      />
      {open && (
        <div className="absolute z-30 mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">Sonuç yok</div>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onPick(p);
                  setQ("");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
              >
                <div className="relative w-9 h-9 shrink-0 rounded bg-slate-100 overflow-hidden">
                  {p.image && <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-slate-500">{p.code}</div>
                  <div className="text-sm text-slate-900 truncate">{p.name}</div>
                </div>
                <div className="ml-auto text-[10px] text-slate-400 shrink-0">{p.categoryName}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SummaryTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: [string, string[], boolean?][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-brand-950 text-white text-xs">
            <th className="px-3 py-2 text-left uppercase">{title}</th>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 text-right font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, values, strong]) => (
            <tr key={label} className={cn("border-t border-slate-100", strong && "bg-slate-50 font-semibold")}>
              <td className="px-3 py-2 text-slate-700">{label}</td>
              {values.map((v, i) => (
                <td key={i} className="px-3 py-2 text-right tabular-nums">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
