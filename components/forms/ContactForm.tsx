"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { PhoneField, PHONE_REGEX } from "./PhoneField";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .regex(PHONE_REGEX)
    .or(z.literal(""))
    .optional(),
  message: z.string().min(10),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function ContactForm({ locale, dict }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "contact", locale }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "block w-full rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-sm text-brand-950 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <label className="block">
        <span className="block text-sm font-medium text-brand-800 mb-1.5">
          {dict.quote.fields.name} <span className="text-accent-500">*</span>
        </span>
        <input
          {...register("name")}
          className={inputClass}
          type="text"
          autoComplete="name"
          placeholder={dict.quote.placeholders.name}
        />
        {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-brand-800 mb-1.5">
          {dict.quote.fields.email} <span className="text-accent-500">*</span>
        </span>
        <input
          {...register("email")}
          className={inputClass}
          type="email"
          autoComplete="email"
          placeholder={dict.quote.placeholders.email}
        />
        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-brand-800 mb-1.5">{dict.quote.fields.phone}</span>
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
        {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-brand-800 mb-1.5">
          {dict.quote.fields.message} <span className="text-accent-500">*</span>
        </span>
        <textarea
          {...register("message")}
          className={`${inputClass} min-h-32 resize-y`}
          rows={5}
          placeholder={dict.quote.placeholders.message}
        />
        {errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}
      </label>

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
    </form>
  );
}
