"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiImageUpload } from "@/components/panel/multi-image-upload";
import { SpecsEditor } from "@/components/panel/specs-editor";
import { RichTextEditor } from "@/components/panel/rich-text-editor";
import { slugify } from "@/lib/slug";
import type { Product } from "@/lib/db";
import type { ProductFormState } from "@/lib/actions-products";

type CategoryOption = { id: number; nameTr: string; depth?: number };

const PRODUCT_FIELD_LABELS: Record<string, string> = {
  categoryId: "Kategori",
  code: "Ürün kodu",
  slug: "Slug",
  nameTr: "Ürün adı (TR)",
  nameEn: "Ürün adı (EN)",
  descriptionTr: "Açıklama (TR)",
  descriptionEn: "Açıklama (EN)",
  imageUrl: "Kapak görseli",
  images: "Görseller",
  sortOrder: "Sıra",
  specs: "Teknik özellikler",
};

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

      <Card>
        <CardHeader>
          <CardTitle>Görseller</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUpload
            name="imagesJson"
            defaultValue={product?.images ?? (product?.imageUrl ? [product.imageUrl] : [])}
            max={8}
            hint="PNG/JPG/WebP, max 5MB • İlk görsel kapak olarak kullanılır"
          />
        </CardContent>
      </Card>

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
                    <RichTextEditor
                      name="descriptionTr"
                      defaultValue={product?.descriptionTr ?? ""}
                      placeholder="Ürün hakkında detaylı açıklama…"
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
                    <RichTextEditor
                      name="descriptionEn"
                      defaultValue={product?.descriptionEn ?? ""}
                      placeholder="Detailed product description…"
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
              <CardTitle>Kategori & Yerleşim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Kategori" error={fe.categoryId}>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kategori seçin">
                      {(value) => {
                        const match = categories.find((c) => String(c.id) === String(value));
                        return match
                          ? `${"— ".repeat(match.depth ?? 0)}${match.nameTr}`
                          : "Kategori seçin";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {"— ".repeat(c.depth ?? 0)}
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
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="font-semibold">{state.error}</div>
          {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs">
              {Object.entries(state.fieldErrors).map(([field, msg]) => (
                <li key={field}>
                  <span className="font-semibold">{PRODUCT_FIELD_LABELS[field] ?? field}</span>: {msg}
                </li>
              ))}
            </ul>
          )}
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
