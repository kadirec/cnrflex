"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/panel/image-upload";
import type { SiteSettings } from "@/lib/db";
import { updateSettingsAction, type SettingsFormState } from "@/lib/actions-settings";

type Props = {
  settings: SiteSettings | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      <Save className="w-4 h-4" />
      {pending ? "Kaydediliyor..." : "Kaydet"}
    </Button>
  );
}

export function SettingsForm({ settings }: Props) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(updateSettingsAction, {
    ok: false,
  });

  useEffect(() => {
    if (state.ok) toast.success("Ayarlar kaydedildi");
    else if (state.error && !state.fieldErrors) toast.error(state.error);
  }, [state]);

  const v = <K extends keyof SiteSettings>(key: K): string => {
    const value = settings?.[key];
    return typeof value === "string" ? value : "";
  };

  return (
    <form action={formAction} className="space-y-6">
      <Tabs defaultValue="contact">
        <TabsList>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="pixels">Analytics & Pixel</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="E-posta">
                <Input name="contactEmail" defaultValue={v("contactEmail")} type="email" />
              </Field>
              <Field label="Telefon">
                <Input name="contactPhone" defaultValue={v("contactPhone")} />
              </Field>
              <Field label="WhatsApp numarası" hint="Sadece rakamlar, örn: 905426106577">
                <Input name="contactWhatsapp" defaultValue={v("contactWhatsapp")} />
              </Field>
              <Field label="Google Maps embed URL">
                <Input name="mapEmbedUrl" defaultValue={v("mapEmbedUrl")} placeholder="https://www.google.com/maps/embed?..." />
              </Field>
              <Field label="Adres (TR)" className="sm:col-span-2">
                <Textarea name="addressTr" rows={2} defaultValue={v("addressTr")} />
              </Field>
              <Field label="Adres (EN)" className="sm:col-span-2">
                <Textarea name="addressEn" rows={2} defaultValue={v("addressEn")} />
              </Field>
              <Field label="Çalışma saatleri (TR)">
                <Input name="workingHoursTr" defaultValue={v("workingHoursTr")} />
              </Field>
              <Field label="Çalışma saatleri (EN)">
                <Input name="workingHoursEn" defaultValue={v("workingHoursEn")} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Instagram URL">
                <Input name="instagramUrl" defaultValue={v("instagramUrl")} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="Facebook URL">
                <Input name="facebookUrl" defaultValue={v("facebookUrl")} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="LinkedIn URL">
                <Input name="linkedinUrl" defaultValue={v("linkedinUrl")} placeholder="https://linkedin.com/..." />
              </Field>
              <Field label="YouTube URL">
                <Input name="youtubeUrl" defaultValue={v("youtubeUrl")} placeholder="https://youtube.com/..." />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Varsayılan SEO Meta</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title (TR)">
                <Input name="defaultMetaTitleTr" defaultValue={v("defaultMetaTitleTr")} />
              </Field>
              <Field label="Meta title (EN)">
                <Input name="defaultMetaTitleEn" defaultValue={v("defaultMetaTitleEn")} />
              </Field>
              <Field label="Meta description (TR)" className="sm:col-span-2">
                <Textarea name="defaultMetaDescriptionTr" rows={3} defaultValue={v("defaultMetaDescriptionTr")} />
              </Field>
              <Field label="Meta description (EN)" className="sm:col-span-2">
                <Textarea name="defaultMetaDescriptionEn" rows={3} defaultValue={v("defaultMetaDescriptionEn")} />
              </Field>
              <Field label="Varsayılan OG görseli" className="sm:col-span-2" hint="Sosyal paylaşımlarda kullanılır (1200×630 önerilir)">
                <ImageUpload name="defaultOgImageUrl" defaultValue={v("defaultOgImageUrl")} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pixels" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics &amp; Pixel ID&apos;leri</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Google Analytics 4 ID" hint="Örn: G-XXXXXXXXXX">
                <Input name="gaMeasurementId" defaultValue={v("gaMeasurementId")} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="Google Tag Manager ID" hint="Örn: GTM-XXXXXXX">
                <Input name="gtmContainerId" defaultValue={v("gtmContainerId")} placeholder="GTM-XXXXXXX" />
              </Field>
              <Field label="Meta (Facebook) Pixel ID" className="sm:col-span-2">
                <Input name="metaPixelId" defaultValue={v("metaPixelId")} placeholder="1234567890" />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Özel Kod Ekleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="<head> içine eklenecek özel kod"
                hint="Doğrudan HTML olarak gömülür. Yalnızca güvendiğiniz snippet'ları ekleyin."
              >
                <Textarea
                  name="headSnippet"
                  rows={6}
                  defaultValue={v("headSnippet")}
                  className="font-mono text-xs"
                  placeholder="<!-- Özel <head> kodları -->"
                />
              </Field>
              <Field
                label="</body> öncesi eklenecek özel kod"
                hint="Sayfa sonuna eklenir; chat widget vb. için kullanılabilir."
              >
                <Textarea
                  name="bodySnippet"
                  rows={6}
                  defaultValue={v("bodySnippet")}
                  className="font-mono text-xs"
                  placeholder="<!-- Özel body kodları -->"
                />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
