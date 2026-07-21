"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/panel/image-upload";
import { SpecsEditor } from "@/components/panel/specs-editor";
import { slugify } from "@/lib/slug";
import type { Product } from "@/lib/db";
import type { ProductFormState } from "@/lib/actions-products";

type CategoryOption = { id: number; nameTr: string };

type Props = {
  product?: Product;
  categories: CategoryOption[];
  action: (prev: ProductFormState, fd: FormData) => Promise<ProductFormState>;
  mode: "create" | "edit";
  defaultCategoryId?: number;
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

export function ProductForm({ product, categories, action, mode, defaultCategoryId }: Props) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(action, { ok: false });
  const [nameTr, setNameTr] = useState(product?.nameTr ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [categoryId, setCategoryId] = useState<string>(
    String(product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? ""),
  );

  useEffect(() => {
    if (!slugTouched && mode === "create") setSlug(slugify(nameTr));
  }, [nameTr, slugTouched, mode]);

  useEffect(() => {
    if (state.ok) toast.success("Ürün güncellendi");
    else if (state.error && !state.fieldErrors) toast.error(state.error);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="categoryId" value={categoryId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="tr">
                <TabsList>
                  <TabsTrigger value="tr">Türkçe</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="tr" className="space-y-4 pt-4">
                  <Field label="Ürün adı (TR)" error={fe.nameTr}>
                    <Input
                      name="nameTr"
                      value={nameTr}
                      onChange={(e) => setNameTr(e.target.value)}
                      required
                      placeholder="Otomatik Kepenk Fırçalı Dikme Fitili"
                    />
                  </Field>
                  <Field label="Açıklama (TR)" error={fe.descriptionTr}>
                    <Textarea
                      name="descriptionTr"
                      rows={4}
                      defaultValue={product?.descriptionTr ?? ""}
                    />
                  </Field>
                </TabsContent>

                <TabsContent value="en" className="space-y-4 pt-4">
                  <Field label="Product name (EN)" error={fe.nameEn}>
                    <Input
                      name="nameEn"
                      defaultValue={product?.nameEn ?? ""}
                      required
                      placeholder="Brushed Vertical Shutter Seal"
                    />
                  </Field>
                  <Field label="Description (EN)" error={fe.descriptionEn}>
                    <Textarea
                      name="descriptionEn"
                      rows={4}
                      defaultValue={product?.descriptionEn ?? ""}
                    />
                  </Field>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teknik özellikler</CardTitle>
            </CardHeader>
            <CardContent>
              <SpecsEditor name="specsJson" defaultValue={product?.specs ?? null} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Görsel</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload name="imageUrl" defaultValue={product?.imageUrl} hint="PNG/JPG/WebP, max 5MB" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kategori & Yerleşim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Kategori" error={fe.categoryId}>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nameTr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Ürün kodu" error={fe.code}>
                <Input
                  name="code"
                  defaultValue={product?.code ?? ""}
                  required
                  placeholder="CNR-OK-01"
                />
              </Field>
              <Field label="Slug" error={fe.slug} hint="/urunler/[kategori]/[slug]">
                <Input
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  required
                />
              </Field>
              <Field label="Sıra">
                <Input name="sortOrder" type="number" min={0} defaultValue={product?.sortOrder ?? 0} />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>

      {state.error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
