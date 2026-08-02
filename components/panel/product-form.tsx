"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Save, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiImageUpload } from "@/components/panel/multi-image-upload";
import { SpecsEditor } from "@/components/panel/specs-editor";
import { RichTextEditor } from "@/components/panel/rich-text-editor";
import { translateToEn } from "@/lib/actions-translate";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
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
  rollLength: "Top sarımı (MT)",
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
  const [nameEn, setNameEn] = useState(product?.nameEn ?? "");
  const [descriptionTr, setDescriptionTr] = useState(product?.descriptionTr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(product?.descriptionEn ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [categoryId, setCategoryId] = useState<string>(
    String(product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? ""),
  );
  const [translatingName, startTranslatingName] = useTransition();
  const [translatingDesc, startTranslatingDesc] = useTransition();

  useEffect(() => {
    if (!slugTouched && mode === "create") setSlug(slugify(nameTr));
  }, [nameTr, slugTouched, mode]);

  useEffect(() => {
    if (state.ok) toast.success("Ürün güncellendi");
    else if (state.error && !state.fieldErrors) toast.error(state.error);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  const handleTranslateName = () => {
    if (!nameTr.trim()) {
      toast.error("Önce TR ürün adını girin");
      return;
    }
    startTranslatingName(async () => {
      const res = await translateToEn(nameTr, "text");
      if (res.ok) {
        setNameEn(res.text);
        toast.success("Ürün adı çevrildi");
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleTranslateDescription = () => {
    if (!descriptionTr.trim() || descriptionTr === "<p></p>") {
      toast.error("Önce TR açıklamayı girin");
      return;
    }
    startTranslatingDesc(async () => {
      const res = await translateToEn(descriptionTr, "html");
      if (res.ok) {
        setDescriptionEn(res.text);
        toast.success("Açıklama çevrildi");
      } else {
        toast.error(res.error);
      }
    });
  };

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
                      value={descriptionTr}
                      onChange={setDescriptionTr}
                      placeholder="Ürün hakkında detaylı açıklama…"
                    />
                  </Field>
                </TabsContent>

                <TabsContent value="en" className="space-y-4 pt-4">
                  <Field
                    label="Product name (EN)"
                    error={fe.nameEn}
                    action={
                      <TranslateButton
                        pending={translatingName}
                        onClick={handleTranslateName}
                        disabled={!nameTr.trim()}
                      />
                    }
                  >
                    <Input
                      name="nameEn"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="Boş bırakılırsa TR değeri kullanılır"
                    />
                  </Field>
                  <Field
                    label="Description (EN)"
                    error={fe.descriptionEn}
                    action={
                      <TranslateButton
                        pending={translatingDesc}
                        onClick={handleTranslateDescription}
                        disabled={!descriptionTr.trim() || descriptionTr === "<p></p>"}
                      />
                    }
                  >
                    <RichTextEditor
                      name="descriptionEn"
                      value={descriptionEn}
                      onChange={setDescriptionEn}
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
              <Field
                label="Top sarımı (MT)"
                error={fe.rollLength}
                hint="Bir topta kaç metre olduğunu girin. Boş bırakılabilir."
              >
                <Input
                  name="rollLength"
                  type="number"
                  min={1}
                  step={1}
                  defaultValue={product?.rollLength ?? ""}
                  placeholder="Örn. 50"
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
  action,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {action}
      </div>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function TranslateButton({
  pending,
  disabled,
  onClick,
}: {
  pending: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending || disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-white px-2.5 py-1 text-xs font-medium text-brand-700 shadow-sm transition",
        "hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50 disabled:pointer-events-none",
      )}
      title="TR alanından otomatik çevir"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Çevriliyor…
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5" />
          TR&apos;den çevir
        </>
      )}
    </button>
  );
}
