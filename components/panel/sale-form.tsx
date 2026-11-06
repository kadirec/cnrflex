"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PackagePlus, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DecimalInput, Field } from "@/components/panel/offer-settings-fields";
import { ProductPicker } from "@/components/panel/offer-form";
import type { OfferProductOption } from "@/lib/offers";
import type { SaleItem, SaleKind, SaleStatus } from "@/lib/db/schema";
import { saveSale } from "@/lib/actions-customers";
import {
  computeSale,
  formatMoney,
  SALE_STATUSES,
  SALE_STATUS_LABELS,
  SALE_STATUS_STYLES,
  SALE_UNITS,
} from "@/lib/customer-calc";

export type SaleDraft = {
  saleDate: string;
  kind: SaleKind;
  status: SaleStatus;
  items: SaleItem[];
  vatRate: number;
  notes: string;
};

const selectCls = "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm";

export function SaleForm({
  customerId,
  saleId,
  initial,
  products,
}: {
  customerId: number;
  saleId?: number;
  initial: SaleDraft;
  products: OfferProductOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [d, setD] = useState<SaleDraft>(initial);
  const set = <K extends keyof SaleDraft>(k: K, v: SaleDraft[K]) => setD((x) => ({ ...x, [k]: v }));
  const updateItem = (i: number, patch: Partial<SaleItem>) =>
    set("items", d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const totals = useMemo(() => computeSale(d.items, d.vatRate), [d.items, d.vatRate]);

  const onSave = () =>
    startTransition(async () => {
      const res = await saveSale(customerId, d, saleId);
      if (!res.ok) return void toast.error(res.error);
      toast.success(saleId ? "Kayıt güncellendi" : "Kayıt eklendi");
      router.push(`/panel/customers/${customerId}`);
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Belge</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Field label="Tarih">
            <Input type="date" value={d.saleDate} onChange={(e) => set("saleDate", e.target.value)} />
          </Field>
          <Field label="Tür">
            <select value={d.kind} onChange={(e) => set("kind", e.target.value as SaleKind)} className={selectCls}>
              <option value="sale">Satış</option>
              <option value="return">İade (bakiyeden düşer)</option>
            </select>
          </Field>
          <Field label="KDV (%) — fiyatlar KDV hariç ise">
            <DecimalInput value={d.vatRate} onChange={(v) => set("vatRate", v ?? 0)} />
          </Field>
          <div className="space-y-1.5">
            <div className="text-xs text-slate-600 font-medium">Durum</div>
            <div className="flex flex-wrap gap-1.5">
              {SALE_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                    d.status === s
                      ? cn(SALE_STATUS_STYLES[s], "ring-2 ring-offset-1 ring-current")
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {SALE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          {d.status === "order" && (
            <p className="sm:col-span-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Sipariş durumundaki kayıtlar ürün gönderilene kadar bakiyeye yansımaz. Gönderildiğinde durumu
              &quot;Teslim edildi&quot; yapın.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle>Kalemler</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <ProductPicker
              products={products}
              onPick={(p) =>
                set("items", [
                  ...d.items,
                  { productId: p.id, code: p.code, name: p.name, unit: "MT", quantity: 0, unitPrice: 0 },
                ])
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => set("items", [...d.items, { code: "", name: "", unit: "ADET", quantity: 1, unitPrice: 0 }])}
            >
              <PackagePlus /> Serbest Satır
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {d.items.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 border border-dashed rounded-lg">
              Katalogdan ürün arayıp ekleyin veya serbest satır (KDV farkı, nakliye vb.) girin.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[760px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-500 text-left">
                    <th className="px-2 py-2 w-44">Ürün Kodu</th>
                    <th className="px-2 py-2">Açıklama</th>
                    <th className="px-2 py-2 w-28">Miktar</th>
                    <th className="px-2 py-2 w-24">Birim</th>
                    <th className="px-2 py-2 w-32">Birim Fiyat ₺</th>
                    <th className="px-2 py-2 w-32 text-right">Tutar</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {d.items.map((it, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-2 py-2">
                        <Input value={it.code} onChange={(e) => updateItem(i, { code: e.target.value })} />
                      </td>
                      <td className="px-2 py-2">
                        <Input value={it.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
                      </td>
                      <td className="px-2 py-2">
                        <DecimalInput value={it.quantity} onChange={(v) => updateItem(i, { quantity: v ?? 0 })} />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={it.unit}
                          onChange={(e) => updateItem(i, { unit: e.target.value as SaleItem["unit"] })}
                          className={selectCls}
                        >
                          {SALE_UNITS.map((u) => (
                            <option key={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <DecimalInput value={it.unitPrice} onChange={(v) => updateItem(i, { unitPrice: v ?? 0 })} />
                      </td>
                      <td className="px-2 py-2 text-right font-medium tabular-nums">
                        {formatMoney((it.quantity || 0) * (it.unitPrice || 0))}
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => set("items", d.items.filter((_, idx) => idx !== i))}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                          aria-label="Satırı sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <Row label="Ara Toplam" value={formatMoney(totals.subtotal)} />
            {d.vatRate > 0 && <Row label={`KDV (%${d.vatRate})`} value={formatMoney(totals.vatTotal)} />}
            <Row label={d.kind === "return" ? "İade Toplamı" : "Genel Toplam"} value={formatMoney(totals.total)} strong />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Not</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={d.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="ör. Müşteri kendi logolu tapasını istiyor"
          />
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 bg-white/90 backdrop-blur border-t border-slate-200 flex justify-end">
        <Button type="button" size="lg" onClick={onSave} disabled={pending}>
          <Save /> {pending ? "Kaydediliyor…" : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", strong && "border-t border-slate-200 pt-1 font-semibold text-slate-900")}>
      <span className="text-slate-600">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
