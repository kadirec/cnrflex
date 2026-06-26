"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

import { categories } from "@/content/products";
import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { PhoneField, PHONE_REGEX } from "./PhoneField";

const CUSTOM_CATEGORY_VALUE = "__other__";
const MAX_FILES = 4;
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const schema = z
  .object({
    name: z.string().min(2),
    company: z.string().optional(),
    email: z.string().email(),
    phone: z.string().regex(PHONE_REGEX),
    category: z.string().min(1),
    customCategory: z.string().optional(),
    quantity: z.string().optional(),
    message: z.string().min(10),
    website: z.string().max(0).optional(),
  })
  .refine(
    (d) => d.category !== CUSTOM_CATEGORY_VALUE || (d.customCategory && d.customCategory.trim().length >= 2),
    { path: ["customCategory"], message: "required" },
  );

type FormData = z.infer<typeof schema>;

type Props = {
  locale: Locale;
  dict: Dictionary;
  onSuccess?: () => void;
};

export function CustomRequestForm({ locale, dict, onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.slug, label: c.name[locale] })),
    [locale],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "", customCategory: "", phone: "" },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFileError("");
    let err = "";
    const accepted: File[] = [];
    for (const f of Array.from(incoming)) {
      if (!ACCEPTED_MIME.includes(f.type)) {
        err = dict.custom.errors.unsupportedType;
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        err = dict.custom.errors.fileTooLarge;
        continue;
      }
      accepted.push(f);
    }
    setFiles((prev) => {
      const next = [...prev, ...accepted];
      if (next.length > MAX_FILES) {
        err = dict.custom.errors.tooManyFiles;
        return next.slice(0, MAX_FILES);
      }
      return next;
    });
    if (err) setFileError(err);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setFileError("");
  };

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const fd = new FormData();
      fd.set("type", "custom");
      fd.set("locale", locale);
      fd.set("name", data.name);
      if (data.company) fd.set("company", data.company);
      fd.set("email", data.email);
      fd.set("phone", data.phone);
      if (data.category !== CUSTOM_CATEGORY_VALUE) fd.set("category", data.category);
      if (data.customCategory) fd.set("customCategory", data.customCategory.trim());
      if (data.quantity) fd.set("quantity", data.quantity);
      fd.set("message", data.message);
      if (data.website) fd.set("website", data.website);
      files.forEach((f) => fd.append("attachments", f, f.name));

      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      reset({ category: "", customCategory: "", phone: "" });
      setFiles([]);
      setFileError("");
      if (onSuccess) setTimeout(onSuccess, 1500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={dict.quote.fields.name} required error={errors.name?.message}>
          <input
            {...register("name")}
            className="form-input"
            type="text"
            autoComplete="name"
            placeholder={dict.quote.placeholders.name}
          />
        </Field>
        <Field label={dict.quote.fields.company} error={errors.company?.message}>
          <input
            {...register("company")}
            className="form-input"
            type="text"
            autoComplete="organization"
            placeholder={dict.quote.placeholders.company}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={dict.quote.fields.email} required error={errors.email?.message}>
          <input
            {...register("email")}
            className="form-input"
            type="email"
            autoComplete="email"
            placeholder={dict.quote.placeholders.email}
          />
        </Field>
        <Field label={dict.quote.fields.phone} required error={errors.phone?.message}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.phone}
              />
            )}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={dict.quote.fields.category} required error={errors.category?.message}>
          <select {...register("category")} className="form-input">
            <option value="">{dict.quote.selectCategory}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            <option value={CUSTOM_CATEGORY_VALUE}>{dict.custom.otherCategory}</option>
          </select>
        </Field>
        <Field label={dict.quote.fields.quantity} error={errors.quantity?.message}>
          <input
            {...register("quantity")}
            className="form-input"
            type="text"
            placeholder={dict.quote.placeholders.quantity}
          />
        </Field>
      </div>

      {selectedCategory === CUSTOM_CATEGORY_VALUE && (
        <Field label={dict.custom.customCategoryLabel} required error={errors.customCategory?.message}>
          <input
            {...register("customCategory")}
            className="form-input"
            type="text"
            placeholder={dict.custom.customCategoryPlaceholder}
          />
        </Field>
      )}

      <Field label={dict.custom.detailsLabel} required error={errors.message?.message}>
        <textarea
          {...register("message")}
          className="form-input min-h-32 resize-y"
          rows={5}
          placeholder={dict.custom.detailsPlaceholder}
        />
      </Field>

      <div>
        <span className="block text-sm font-medium text-brand-800 mb-1.5">{dict.custom.attachmentsLabel}</span>
        <label
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition px-4 py-8 text-sm cursor-pointer ${
            files.length >= MAX_FILES
              ? "border-brand-100 bg-brand-50/30 text-brand-400 cursor-not-allowed"
              : "border-brand-200 hover:border-accent-500 bg-brand-50/50 text-brand-700"
          }`}
        >
          <Upload className="h-6 w-6" />
          <span className="font-medium">{dict.custom.attachmentsPrompt}</span>
          <span className="text-xs text-brand-500">{dict.custom.attachmentsHint}</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_MIME.join(",")}
            disabled={files.length >= MAX_FILES}
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
          />
        </label>
        {fileError && <span className="mt-2 block text-xs text-red-600">{fileError}</span>}
        {files.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="relative rounded-lg border border-brand-100 bg-white overflow-hidden group"
              >
                {previews[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previews[i]} alt={f.name} className="block h-24 w-full object-cover" />
                ) : (
                  <div className="h-24 w-full bg-brand-50" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label="Remove"
                  className="absolute top-1.5 right-1.5 grid place-items-center h-6 w-6 rounded-full bg-white/90 text-brand-700 hover:bg-red-50 hover:text-red-600 shadow transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="px-2 py-1.5 text-[11px]">
                  <div className="truncate font-medium text-brand-900">{f.name}</div>
                  <div className="text-brand-500">{(f.size / 1024).toFixed(0)} KB</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "loading" ? dict.quote.fields.submitting : dict.quote.fields.submit}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          {dict.quote.success}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          {dict.quote.error}
        </div>
      )}

      <style jsx>{`
        :global(.form-input) {
          display: block;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-brand-200);
          background-color: white;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--color-brand-950);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.form-input:focus) {
          border-color: var(--color-accent-500);
          box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.15);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand-800 mb-1.5">
        {label}
        {required && <span className="text-accent-500 ml-0.5">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
