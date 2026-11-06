"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { OfferSettingsFields } from "@/components/panel/offer-settings-fields";
import { saveOfferDefaults } from "@/lib/actions-offers";
import type { ResolvedOfferDefaults } from "@/lib/offers";

export function OfferDefaultsForm({ initial }: { initial: ResolvedOfferDefaults }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initial.settings);
  const [notes, setNotes] = useState(initial.notes);

  const onSave = () =>
    startTransition(async () => {
      const res = await saveOfferDefaults({ settings, notes });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Teklif ayarları kaydedildi");
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <OfferSettingsFields settings={settings} onChange={setSettings} />

      <Card>
        <CardHeader>
          <CardTitle>Varsayılan Notlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <p className="mt-2 text-xs text-slate-500">Her satır teklifte ayrı bir madde olarak gösterilir.</p>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        Bu ayarlar yalnızca yeni oluşturulan teklifleri etkiler; kayıtlı teklifler kendi oranlarıyla kalır.
      </p>

      <div className="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 bg-white/90 backdrop-blur border-t border-slate-200 flex justify-end">
        <Button type="button" size="lg" onClick={onSave} disabled={pending}>
          <Save /> {pending ? "Kaydediliyor…" : "Ayarları Kaydet"}
        </Button>
      </div>
    </div>
  );
}
