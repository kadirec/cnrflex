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
import { RichTextEditor } from "@/components/panel/rich-text-editor";
import { slugify } from "@/lib/slug";
import type { BlogPost, BlogCategory } from "@/lib/db";
import type { BlogFormState } from "@/lib/actions-blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

type Props = {
  post?: BlogPost;
  action: (prev: BlogFormState, fd: FormData) => Promise<BlogFormState>;
  mode: "create" | "edit";
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

function toDateTimeLocal(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BlogForm({ post, action, mode }: Props) {
  const [state, formAction] = useActionState<BlogFormState, FormData>(action, { ok: false });
  const [titleTr, setTitleTr] = useState(post?.titleTr ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [category, setCategory] = useState<BlogCategory>(
    (post?.category as BlogCategory) ?? "malzeme-rehberleri",
  );
  const [isPublished, setIsPublished] = useState<boolean>(!!post?.publishedAt);

  const onTitleTrChange = (value: string) => {
    setTitleTr(value);
    if (!slugTouched && mode === "create") {
      setSlug(slugify(value));
    }
  };

  useEffect(() => {
    if (state.ok) toast.success("Blog yazısı kaydedildi");
    else if (state.error && !state.fieldErrors) toast.error(state.error);
  }, [state]);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="isPublished" value={isPublished ? "true" : "false"} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İçerik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="tr">
                <TabsList>
                  <TabsTrigger value="tr">Türkçe</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="tr" className="space-y-4 pt-4">
                  <Field label="Başlık (TR)" error={fe.titleTr}>
                    <Input
                      name="titleTr"
                      value={titleTr}
                      onChange={(e) => onTitleTrChange(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Özet (TR)" error={fe.excerptTr} hint="Blog listesinde görünen kısa açıklama">
                    <Textarea name="excerptTr" rows={3} defaultValue={post?.excerptTr ?? ""} />
                  </Field>
                  <Field label="İçerik (TR)" error={fe.contentTr}>
                    <RichTextEditor name="contentTr" defaultValue={post?.contentTr ?? ""} />
                  </Field>
                </TabsContent>

                <TabsContent value="en" className="space-y-4 pt-4">
                  <Field label="Title (EN)" error={fe.titleEn} hint="Boş bırakılırsa TR değeri kullanılır">
                    <Input name="titleEn" defaultValue={post?.titleEn ?? ""} />
                  </Field>
                  <Field label="Excerpt (EN)" error={fe.excerptEn}>
                    <Textarea name="excerptEn" rows={3} defaultValue={post?.excerptEn ?? ""} />
                  </Field>
                  <Field label="Content (EN)" error={fe.contentEn}>
                    <RichTextEditor name="contentEn" defaultValue={post?.contentEn ?? ""} />
                  </Field>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yayın</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium">Yayınla</span>
                  <p className="text-xs text-slate-500 mt-0.5">Kapalıysa taslak olarak kalır.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-5 w-9 appearance-none rounded-full bg-slate-300 checked:bg-accent-500 relative cursor-pointer transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition checked:after:translate-x-4"
                />
              </label>
              <Field label="Yayın tarihi" hint="Boş bırakılırsa şu an kabul edilir">
                <Input
                  name="publishedAt"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(post?.publishedAt)}
                  disabled={!isPublished}
                />
              </Field>
              <Field label="Kategori" error={fe.category}>
                <Select value={category} onValueChange={(v) => setCategory(v as BlogCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.label.tr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Slug" error={fe.slug} hint="URL için: /blog/[slug]">
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
              <div className="grid grid-cols-2 gap-3">
                <Field label="Yazar">
                  <Input name="author" defaultValue={post?.author ?? "CNR Seal"} />
                </Field>
                <Field label="Okuma süresi (dk)">
                  <Input name="readingTime" type="number" min={1} defaultValue={post?.readingTime ?? 3} />
                </Field>
              </div>
              <Field label="Sıra">
                <Input name="sortOrder" type="number" defaultValue={post?.sortOrder ?? 0} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kapak Görseli</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                name="coverImageUrl"
                defaultValue={post?.coverImageUrl}
                hint="PNG/JPG/WebP, max 5MB"
              />
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
                  <span className="font-semibold">{field}</span>: {msg}
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
