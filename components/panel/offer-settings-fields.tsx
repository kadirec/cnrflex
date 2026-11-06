"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { round2 } from "@/lib/offer-calc";
import type { OfferSettings } from "@/lib/db/schema";

/** Kart taksit oranları, senet/çek peşinat ve aylık maliyet oranları, KDV ve havale indirimi. */
export function OfferSettingsFields({
  settings: s,
  onChange,
}: {
  settings: OfferSettings;
  onChange: (next: OfferSettings) => void;
}) {
  const setSetting = <K extends keyof OfferSettings>(key: K, value: OfferSettings[K]) =>
    onChange({ ...s, [key]: value });

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kredi Kartı Taksit Oranları</CardTitle>
            <Toggle checked={s.showCard} onChange={(v) => setSetting("showCard", v)} label="Teklifte göster" />
          </CardHeader>
          <CardContent className={cn("space-y-3", !s.showCard && "opacity-50 pointer-events-none")}>
            {s.installments.map((inst, i) => (
              <div key={i} className="flex items-end gap-3">
                <Field label="Taksit sayısı" className="w-32">
                  <DecimalInput
                    value={inst.count}
                    onChange={(v) =>
                      setSetting(
                        "installments",
                        s.installments.map((x, idx) =>
                          idx === i ? { ...x, count: Math.max(1, Math.round(v ?? 1)) } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Kart farkı (%)" className="w-36">
                  <DecimalInput
                    value={inst.rate}
                    onChange={(v) =>
                      setSetting(
                        "installments",
                        s.installments.map((x, idx) => (idx === i ? { ...x, rate: v ?? 0 } : x)),
                      )
                    }
                  />
                </Field>
                <IconRemove
                  onClick={() => setSetting("installments", s.installments.filter((_, idx) => idx !== i))}
                />
              </div>
            ))}
            {s.installments.length < 8 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const last = s.installments[s.installments.length - 1];
                  setSetting("installments", [
                    ...s.installments,
                    { count: (last?.count ?? 1) + 1, rate: round2((last?.rate ?? 0) + 2) },
                  ]);
                }}
              >
                <Plus /> Taksit ekle
              </Button>
            )}
            <p className="text-xs text-slate-500">
              Kart birim fiyatı = peşin birim fiyat × (1 + kart farkı %).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Senet / Çek ile Ödeme</CardTitle>
            <Toggle
              checked={s.showDeferred}
              onChange={(v) => setSetting("showDeferred", v)}
              label="Teklifte göster"
            />
          </CardHeader>
          <CardContent className={cn("space-y-4", !s.showDeferred && "opacity-50 pointer-events-none")}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Ödeme aracı">
                <select
                  value={s.deferredLabel}
                  onChange={(e) => setSetting("deferredLabel", e.target.value as OfferSettings["deferredLabel"])}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
                >
                  <option value="Senet">Senet</option>
                  <option value="Çek">Çek</option>
                </select>
              </Field>
              <Field label="Peşinat tutarı (%)">
                <DecimalInput value={s.downPaymentRate} onChange={(v) => setSetting("downPaymentRate", v ?? 0)} />
              </Field>
              <Field label="Aylık maliyet / vade farkı (%)">
                <DecimalInput value={s.monthlyRate} onChange={(v) => setSetting("monthlyRate", v ?? 0)} />
              </Field>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-slate-600">Vadeler (gün)</Label>
              <div className="flex flex-wrap items-center gap-2">
                {s.termDays.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <DecimalInput
                      className="w-20"
                      value={d}
                      onChange={(v) =>
                        setSetting(
                          "termDays",
                          s.termDays.map((x, idx) => (idx === i ? Math.max(1, Math.round(v ?? 30)) : x)),
                        )
                      }
                    />
                    <IconRemove onClick={() => setSetting("termDays", s.termDays.filter((_, idx) => idx !== i))} />
                  </div>
                ))}
                {s.termDays.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSetting("termDays", [...s.termDays, (s.termDays.at(-1) ?? 0) + 30])}
                  >
                    <Plus /> Vade
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Vade farkı = aylık maliyet % × (gün / 30). Peşinat, KDV dahil genel toplam üzerinden alınır; kalan
              tutar senet/çek olarak yazılır.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genel</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="KDV oranı (%)">
            <DecimalInput value={s.vatRate} onChange={(v) => setSetting("vatRate", v ?? 0)} />
          </Field>
          <Field label="Havale ekstra indirim (%)">
            <DecimalInput value={s.transferDiscount} onChange={(v) => setSetting("transferDiscount", v ?? 0)} />
          </Field>
          <p className="col-span-2 self-end text-xs text-slate-500">
            Havale indirimi 0 girilirse teklifte bilgi bandı gösterilmez.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-slate-600">{label}</Label>
      {children}
    </div>
  );
}

function IconRemove({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
      aria-label="Kaldır"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-brand-900"
      />
      {label}
    </label>
  );
}

function toText(v: number | null) {
  return v == null ? "" : String(v).replace(".", ",");
}

/** Türkçe virgüllü ondalık girişi destekleyen sayı alanı. */
export function DecimalInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(toText(value));
  const lastEmitted = useRef<number | null>(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(toText(value));
    }
  }, [value]);

  return (
    <Input
      inputMode="decimal"
      className={cn("tabular-nums", className)}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d.,]/g, "");
        setText(raw);
        const normalized = raw.replace(/\./g, "").replace(",", ".");
        const n = raw === "" ? null : Number(raw.includes(",") ? normalized : raw);
        const next = n == null || Number.isNaN(n) ? null : n;
        lastEmitted.current = next;
        onChange(next);
      }}
    />
  );
}
