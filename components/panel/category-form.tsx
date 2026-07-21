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
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/db";
import type { CategoryFormState } from "@/lib/actions-categories";

export type ParentOption = { id: number; nameTr: string; depth: number };

type Props = {
  category?: Category;
  action: (prev: CategoryFormState, fd: FormData) => Promise<CategoryFormState>;
  mode: "create" | "edit";
  parentOptions: ParentOption[];
  defaultParentId?: number | null;
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

export function CategoryForm({ category, action, mode, parentOptions, defaultParentId }: Props) {
  const [state, formAction] = useActionState<CategoryFormState, FormData>(action, { ok: false });
  const [nameTr, setNameTr] = useState(category?.nameTr ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!category);
  const initialParent = category?.parentId ?? defaultParentId ?? null;
  const [parentId, setParentId] = useState<string>(initialParent === null ? "root" : String(initialParent));

  useEffect(() => {
    if (!slugTouched && mode === "create") {
      setSlug(slugify(nameTr));
    }
  }, [nameTr, slugTouched, mode]);

  useEffect(() => {
    if (state.ok) toast.success("Kategori güncellendi");
    else if (state.error && !state.fieldErrors) toast.error(state.error);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="parentId" value={parentId === "root" ? "" : parentId} />
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
                  <Field label="Kategori adı (TR)" error={fe.nameTr}>
                    <Input
                      name="nameTr"
                      value={nameTr}
                      onChange={(e) => setNameTr(e.target.value)}
                      required
                      placeholder="Otomatik Kepenk Fitilleri"
                    />
                  </Field>
                  <Field label="Kısa açıklama (TR)" error={fe.shortDescriptionTr}>
                    <Textarea
                      name="shortDescriptionTr"
                      rows={2}
                      defaultValue={category?.shortDescriptionTr ?? ""}
                      placeholder="Bir cümlelik özet"
                    />
                  </Field>
                  <Field label="Uzun açıklama (TR)" error={fe.descriptionTr}>
                    <Textarea
                      name="descriptionTr"
                      rows={6}
                      defaultValue={category?.descriptionTr ?? ""}
                    />
                  </Field>
                </TabsContent>

                <TabsContent value="en" className="space-y-4 pt-4">
                  <Field label="Category name (EN)" error={fe.nameEn}>
                    <Input
                      name="nameEn"
                      defaultValue={category?.nameEn ?? ""}
                      required
                      placeholder="Automatic Shutter Seals"
                    />
                  </Field>
                  <Field label="Short description (EN)" error={fe.shortDescriptionEn}>
                    <Textarea
                      name="shortDescriptionEn"
                      rows={2}
                      defaultValue={category?.shortDescriptionEn ?? ""}
                    />
                  </Field>
                  <Field label="Long description (EN)" error={fe.descriptionEn}>
                    <Textarea
                      name="descriptionEn"
                      rows={6}
                      defaultValue={category?.descriptionEn ?? ""}
                    />
                  </Field>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Görsel</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                name="imageUrl"
                defaultValue={category?.imageUrl}
                hint="PNG/JPG/WebP, max 5MB"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yerleşim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Üst kategori" error={fe.parentId} hint="Boş bırakılırsa üst düzey (kök altı) olur">
                <Select value={parentId} onValueChange={(v) => setParentId(v ?? "root")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Ürünler (kök)</SelectItem>
                    {parentOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {"— ".repeat(p.depth + 1)}
                        {p.nameTr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Slug" error={fe.slug} hint="URL için: /urunler/[slug]">
                <Input
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  required
                  placeholder="otomatik-kepenk-fitilleri"
                />
              </Field>
              <Field label="Sıra">
                <Input
                  name="sortOrder"
                  type="number"
                  defaultValue={category?.sortOrder ?? 0}
                  min={0}
                />
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
