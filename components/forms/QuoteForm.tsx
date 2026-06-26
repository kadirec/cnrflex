"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { categories } from "@/content/products";
import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { PhoneField, PHONE_REGEX } from "./PhoneField";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(PHONE_REGEX),
  category: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  locale: Locale;
  dict: Dictionary;
  defaultCategory?: string;
};

export function QuoteForm({ locale, dict, defaultCategory }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.slug,
        label: c.name[locale],
      })),
    [locale],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: defaultCategory ?? "", phone: "" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "quote", locale }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      reset({ category: defaultCategory ?? "", phone: "" });
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
        <Field label={dict.quote.fields.category} error={errors.category?.message}>
          <select {...register("category")} className="form-input">
            <option value="">{dict.quote.selectCategory}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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

      <Field label={dict.quote.fields.message} required error={errors.message?.message}>
        <textarea
          {...register("message")}
          className="form-input min-h-32 resize-y"
          rows={5}
          placeholder={dict.quote.placeholders.message}
        />
      </Field>

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
