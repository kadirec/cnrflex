"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecimalInput, Field } from "@/components/panel/offer-settings-fields";
import type { CustomerPayment, PaymentMethod } from "@/lib/db/schema";
import { savePayment } from "@/lib/actions-customers";
import { DEFERRED_METHODS, PAYMENT_METHODS, PAYMENT_METHOD_LABELS, todayIso } from "@/lib/customer-calc";

const selectCls = "h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm";

type Props = {
  /** Sabit cari (cari detay sayfası) */
  customerId?: number;
  /** Cari seçimi (genel ödemeler listesi) */
  customers?: { id: number; name: string; code: string | null }[];
  payment?: CustomerPayment;
};

export function PaymentDialog({ customerId, customers, payment }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const blank = () => ({
    customerId: payment?.customerId ?? customerId ?? 0,
    paymentDate: payment?.paymentDate ?? todayIso(),
    amount: payment?.amount ?? (null as number | null),
    method: payment?.method ?? ("transfer" as PaymentMethod),
    dueDate: payment?.dueDate ?? "",
    documentNo: payment?.documentNo ?? "",
    description: payment?.description ?? "",
  });
  const [d, setD] = useState(blank);
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));
  const deferred = DEFERRED_METHODS.includes(d.method);

  const onSave = () =>
    startTransition(async () => {
      const res = await savePayment(
        { ...d, amount: d.amount ?? 0, dueDate: deferred && d.dueDate ? d.dueDate : null },
        payment?.id,
      );
      if (!res.ok) return void toast.error(res.error);
      toast.success(payment ? "Ödeme güncellendi" : "Ödeme kaydedildi");
      setOpen(false);
      router.refresh();
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setD(blank());
        setOpen(o);
      }}
    >
      {payment ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-brand-900 hover:bg-slate-100"
          title="Düzenle"
          aria-label="Ödemeyi düzenle"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ) : (
        <Button type="button" size="lg" variant="outline" onClick={() => setOpen(true)}>
          <Wallet /> Ödeme Ekle
        </Button>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{payment ? "Ödemeyi Düzenle" : "Ödeme / Tahsilat Ekle"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customers && !payment && (
            <Field label="Cari *" className="sm:col-span-2">
              <select
                value={d.customerId || ""}
                onChange={(e) => set("customerId", Number(e.target.value))}
                className={selectCls}
              >
                <option value="">Cari seçin…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.code ? ` (${c.code})` : ""}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Tarih">
            <Input type="date" value={d.paymentDate} onChange={(e) => set("paymentDate", e.target.value)} />
          </Field>
          <Field label="Tutar ₺ *">
            <DecimalInput value={d.amount} onChange={(v) => set("amount", v)} />
          </Field>
          <Field label="Ödeme Şekli">
            <select value={d.method} onChange={(e) => set("method", e.target.value as PaymentMethod)} className={selectCls}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {PAYMENT_METHOD_LABELS[m]}
                </option>
              ))}
            </select>
          </Field>
          {deferred ? (
            <Field label="Vade Tarihi">
              <Input type="date" value={d.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </Field>
          ) : (
            <div className="hidden sm:block" />
          )}
          <Field label={deferred ? `${PAYMENT_METHOD_LABELS[d.method]} No` : "Belge / Dekont No"}>
            <Input value={d.documentNo} onChange={(e) => set("documentNo", e.target.value)} />
          </Field>
          <Field label="Açıklama">
            <Input value={d.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Vazgeç
          </Button>
          <Button type="button" onClick={onSave} disabled={pending}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
