"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/panel/offer-settings-fields";
import { saveCustomer } from "@/lib/actions-customers";
import type { CustomerDraft as Draft } from "@/lib/customer-calc";

export function CustomerForm({ customerId, initial }: { customerId?: number; initial: Draft }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [d, setD] = useState<Draft>(
    initial.contacts.length > 0 ? initial : { ...initial, contacts: [{ name: "", phone: "" }] },
  );
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const onSave = () =>
    startTransition(async () => {
      const res = await saveCustomer(d, customerId);
      if (!res.ok) return void toast.error(res.error);
      toast.success(customerId ? "Cari güncellendi" : "Cari eklendi");
      router.push(`/panel/customers/${res.id}`);
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Firma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Firma Adı *">
              <Input value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="ör. GÜVENİŞ KEPENK" />
            </Field>
            <Field label="Cari Kodu">
              <Input value={d.code} onChange={(e) => set("code", e.target.value)} placeholder="ör. GÜVENİŞ KEPENK-4" />
            </Field>
            <Field label="Şehir">
              <Input value={d.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="E-posta">
              <Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Vergi Dairesi">
              <Input value={d.taxOffice} onChange={(e) => set("taxOffice", e.target.value)} />
            </Field>
            <Field label="Vergi No">
              <Input value={d.taxNumber} onChange={(e) => set("taxNumber", e.target.value)} />
            </Field>
            <Field label="Adres" className="sm:col-span-2">
              <Input value={d.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yetkili Kişiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {d.contacts.map((c, i) => (
              <div key={i} className="flex items-end gap-2">
                <Field label="Ad Soyad" className="flex-1">
                  <Input
                    value={c.name}
                    onChange={(e) =>
                      set("contacts", d.contacts.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                    }
                  />
                </Field>
                <Field label="Telefon" className="flex-1">
                  <Input
                    value={c.phone}
                    onChange={(e) =>
                      set("contacts", d.contacts.map((x, idx) => (idx === i ? { ...x, phone: e.target.value } : x)))
                    }
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => set("contacts", d.contacts.filter((_, idx) => idx !== i))}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                  aria-label="Kaldır"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set("contacts", [...d.contacts, { name: "", phone: "" }])}
            >
              <Plus /> Yetkili ekle
            </Button>
            <Field label="Notlar">
              <Textarea rows={4} value={d.notes} onChange={(e) => set("notes", e.target.value)} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="button" size="lg" onClick={onSave} disabled={pending}>
          <Save /> {pending ? "Kaydediliyor…" : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}

