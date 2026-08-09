"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Check,
  X,
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  PenSquare,
  Upload,
} from "lucide-react";

import { type Locale, localePrefix } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import type { PickerProduct } from "@/lib/products";
import { useQuoteCart, type CartItem } from "@/components/cart/QuoteCartContext";
import { cn } from "@/lib/utils";
import { PhoneField, PHONE_REGEX } from "./PhoneField";

const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(PHONE_REGEX),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
});

type ContactData = z.infer<typeof contactSchema>;

const customSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(PHONE_REGEX),
  message: z.string().min(10),
  website: z.string().max(0).optional(),
});

type CustomData = z.infer<typeof customSchema>;

const MAX_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Mode = "catalog" | "custom";
type Step = "select" | "contact";

type Props = {
  locale: Locale;
  dict: Dictionary;
  products: PickerProduct[];
  prefillProductSlug?: string;
  prefillCategorySlug?: string;
  initialMode?: Mode;
};

export function QuoteForm({
  locale,
  dict,
  products,
  prefillProductSlug,
  prefillCategorySlug,
  initialMode = "catalog",
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const cart = useQuoteCart();
  const prefillAppliedRef = useRef(false);

  useEffect(() => {
    if (!cart.hydrated || prefillAppliedRef.current) return;
    if (prefillProductSlug) {
      const p = products.find((x) => x.slug === prefillProductSlug);
      if (p && !cart.isInCart(p.id)) {
        cart.add(toCartFields(p, locale));
      }
    }
    prefillAppliedRef.current = true;
  }, [cart, prefillProductSlug, products, locale]);

  return (
    <div className="space-y-5">
      <ModeTabs locale={locale} mode={mode} onChange={setMode} />
      {mode === "catalog" ? (
        <CatalogFlow
          locale={locale}
          dict={dict}
          products={products}
          prefillCategorySlug={prefillCategorySlug}
          onSwitchToCustom={() => setMode("custom")}
        />
      ) : (
        <CustomFlow
          locale={locale}
          dict={dict}
          onSwitchToCatalog={() => setMode("catalog")}
        />
      )}
    </div>
  );
}

function ModeTabs({
  locale,
  mode,
  onChange,
}: {
  locale: Locale;
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  const tr = locale === "tr";
  return (
    <div
      role="tablist"
      aria-label={tr ? "Talep türü" : "Request type"}
      className="grid gap-3 sm:grid-cols-2"
    >
      <TabButton
        active={mode === "catalog"}
        onClick={() => onChange("catalog")}
        icon={Package}
        label={tr ? "CNR Seal Ürünleri" : "CNR Seal Products"}
        description={
          tr
            ? "Kataloğumuzdan ürün seçip teklif isteyin."
            : "Choose products from our catalog."
        }
      />
      <TabButton
        active={mode === "custom"}
        onClick={() => onChange("custom")}
        icon={PenSquare}
        label={tr ? "Özel Ürün Talebi" : "Custom Product Request"}
        description={
          tr
            ? "Görselinizi paylaşın, size özel çözüm sunalım."
            : "Share your image, get a custom solution."
        }
        accent
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  description,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition shadow-sm",
        active
          ? accent
            ? "border-accent-500 bg-accent-500 text-white shadow-md shadow-accent-500/20"
            : "border-brand-950 bg-brand-950 text-white shadow-md"
          : accent
            ? "border-accent-200 bg-white hover:border-accent-500 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            : "border-brand-200 bg-white hover:border-brand-400 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
      )}
    >
      <span
        className={cn(
          "grid place-items-center h-11 w-11 rounded-xl shrink-0 transition",
          active
            ? "bg-white/15 text-white"
            : accent
              ? "bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white"
              : "bg-brand-50 text-brand-700 group-hover:bg-brand-950 group-hover:text-white",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            "block text-base font-bold leading-tight",
            active ? "text-white" : "text-brand-950",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "block mt-1 text-xs leading-snug",
            active ? "text-white/80" : "text-brand-600",
          )}
        >
          {description}
        </span>
      </span>
      <span
        className={cn(
          "grid place-items-center h-7 w-7 rounded-full shrink-0 transition",
          active
            ? "bg-white/20 text-white"
            : accent
              ? "bg-accent-500 text-white group-hover:translate-x-0.5"
              : "bg-brand-950 text-white group-hover:translate-x-0.5",
        )}
        aria-hidden
      >
        {active ? <Check className="h-4 w-4" strokeWidth={3} /> : <ChevronRight className="h-4 w-4" strokeWidth={2.5} />}
      </span>
    </button>
  );
}

function CatalogFlow({
  locale,
  dict,
  products,
  prefillCategorySlug,
  onSwitchToCustom,
}: {
  locale: Locale;
  dict: Dictionary;
  products: PickerProduct[];
  prefillCategorySlug?: string;
  onSwitchToCustom: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep] = useState<Step>("select");
  const [activeCat, setActiveCat] = useState<string | "all">(prefillCategorySlug ?? "all");
  const [query, setQuery] = useState("");
  const cart = useQuoteCart();

  const categories = useMemo(() => {
    const seen = new Map<string, { name: string; image: string | null }>();
    for (const p of products) {
      if (!seen.has(p.categorySlug)) {
        seen.set(p.categorySlug, { name: p.categoryName[locale], image: p.categoryImage });
      }
    }
    return Array.from(seen, ([slug, meta]) => ({ slug, name: meta.name, image: meta.image }));
  }, [products, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCat !== "all" && p.categorySlug !== activeCat) return false;
      if (!q) return true;
      return p.name[locale].toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    });
  }, [products, activeCat, query, locale]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { phone: "" },
  });

  const toggleProduct = (p: PickerProduct) => {
    cart.toggle(p.id, toCartFields(p, locale));
  };

  const onSubmit = async (data: ContactData) => {
    setStatus("loading");
    try {
      const payload = {
        ...data,
        type: "quote",
        locale,
        items: cart.items.map(({ key: _key, ...rest }) => rest),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      reset({ phone: "" });
      cart.clear();
      setStep("select");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <SuccessScreen
        locale={locale}
        onNewQuote={() => setStatus("idle")}
        onSwitchToCustom={onSwitchToCustom}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <Stepper
        step={step}
        basketCount={cart.count}
        locale={locale}
        onBack={() => setStep("select")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <div className="min-w-0">
          {step === "select" ? (
            <PickerPanel
              locale={locale}
              filtered={filtered}
              categories={categories}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              query={query}
              setQuery={setQuery}
              inBasket={(id) => cart.isInCart(id)}
              toggleProduct={toggleProduct}
            />
          ) : (
            <ContactPanel
              locale={locale}
              dict={dict}
              register={register}
              control={control}
              errors={errors}
              status={status}
            />
          )}
        </div>

        <BasketPanel
          locale={locale}
          basket={cart.items}
          onRemove={cart.remove}
          onUpdate={cart.update}
          onClear={cart.clear}
          onSwitchToCustom={onSwitchToCustom}
          step={step}
          status={status}
          onContinue={() => setStep("contact")}
          onBack={() => setStep("select")}
        />
      </div>

      <FormStyles />
    </form>
  );
}

function CustomFlow({
  locale,
  dict,
  onSwitchToCatalog,
}: {
  locale: Locale;
  dict: Dictionary;
  onSwitchToCatalog: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomData>({
    resolver: zodResolver(customSchema),
    defaultValues: { phone: "" },
  });

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

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

  const onSubmit = async (data: CustomData) => {
    setStatus("loading");
    try {
      const fd = new FormData();
      fd.set("type", "custom");
      fd.set("locale", locale);
      fd.set("name", data.name);
      if (data.company) fd.set("company", data.company);
      fd.set("email", data.email);
      fd.set("phone", data.phone);
      fd.set("message", data.message);
      if (data.website) fd.set("website", data.website);
      files.forEach((f) => fd.append("attachments", f, f.name));

      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      reset({ phone: "" });
      setFiles([]);
      setFileError("");
    } catch {
      setStatus("error");
    }
  };

  const tr = locale === "tr";
  const noFiles = files.length === 0;

  if (status === "success") {
    return (
      <SuccessScreen
        locale={locale}
        variant="custom"
        onNewQuote={() => setStatus("idle")}
        onSwitchToCatalog={onSwitchToCatalog}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <section className="rounded-2xl border border-brand-100 bg-white p-5 lg:p-6 space-y-6">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent-50 text-accent-600 shrink-0">
            <PenSquare className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-brand-950">
              {tr ? "Özel Ürün Talebi" : "Custom Product Request"}
            </h2>
            <p className="text-sm text-brand-600 mt-0.5">
              {tr
                ? "Ürün görselinizi yükleyin, açıklama ve iletişim bilgilerinizi girin. En kısa sürede size dönüş yapalım."
                : "Upload your product image, add a description and contact info. We'll get back shortly."}
            </p>
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-brand-800 mb-2">
            {tr ? "1. Ürün görseli" : "1. Product image"}
            <span className="text-accent-500 ml-1">*</span>
          </span>
          <label
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition px-4 py-10 text-sm cursor-pointer",
              files.length >= MAX_FILES
                ? "border-brand-100 bg-brand-50/30 text-brand-400 cursor-not-allowed"
                : "border-brand-200 hover:border-accent-500 bg-brand-50/40 text-brand-700",
            )}
          >
            <span className="grid place-items-center h-10 w-10 rounded-full bg-white text-accent-600 shadow-sm">
              <Upload className="h-5 w-5" />
            </span>
            <span className="font-semibold text-brand-950">
              {tr ? "Görsel yüklemek için tıklayın" : "Click to upload image"}
            </span>
            <span className="text-xs text-brand-500 text-center max-w-xs">
              {dict.custom.attachmentsHint}
            </span>
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
          {fileError && <p className="mt-2 text-xs text-red-600">{fileError}</p>}
          {noFiles && !fileError && (
            <p className="mt-2 text-xs text-brand-500">
              {tr
                ? "En az bir görsel eklemenizi öneririz — üretim ekibi çok daha hızlı değerlendirir."
                : "We recommend adding at least one image — the team can evaluate much faster."}
            </p>
          )}
          {files.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${f.size}-${i}`}
                  className="relative rounded-lg border border-brand-100 bg-white overflow-hidden"
                >
                  {previews[i] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={previews[i]} alt={f.name} className="block h-28 w-full object-cover" />
                  ) : (
                    <div className="h-28 w-full bg-brand-50" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label={tr ? "Kaldır" : "Remove"}
                    className="absolute top-1.5 right-1.5 grid place-items-center h-6 w-6 rounded-md bg-accent-500 text-white hover:bg-accent-600 transition shadow"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
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

        <div>
          <span className="block text-sm font-semibold text-brand-800 mb-2">
            {tr ? "2. Ürün açıklaması" : "2. Product description"}
            <span className="text-accent-500 ml-1">*</span>
          </span>
          <Field label="" error={errors.message?.message}>
            <textarea
              {...register("message")}
              className="form-input min-h-32 resize-y"
              rows={6}
              placeholder={dict.custom.detailsPlaceholder}
            />
          </Field>
        </div>

        <div>
          <span className="block text-sm font-semibold text-brand-800 mb-3">
            {tr ? "3. İletişim bilgileri" : "3. Contact info"}
          </span>

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
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4" />
            {dict.quote.error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {status === "loading"
              ? tr
                ? "Gönderiliyor…"
                : "Sending…"
              : tr
                ? "Talebi Gönder"
                : "Send Request"}
          </button>
        </div>
      </section>

      <FormStyles />
    </form>
  );
}

function Stepper({
  step,
  basketCount,
  locale,
  onBack,
}: {
  step: Step;
  basketCount: number;
  locale: Locale;
  onBack: () => void;
}) {
  const tr = locale === "tr";
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <ol className="flex items-center gap-3 text-sm">
        <StepBadge
          n={1}
          label={tr ? "Ürün seç" : "Choose products"}
          active={step === "select"}
          done={step === "contact"}
        />
        <ChevronRight className="h-4 w-4 text-brand-300 shrink-0" />
        <StepBadge
          n={2}
          label={tr ? "Teklifi tamamla" : "Complete quote"}
          active={step === "contact"}
          done={false}
          muted={step === "select" && basketCount === 0}
        />
      </ol>
      {step === "contact" && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 hover:border-accent-500 hover:text-accent-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          {tr ? "Ürünlere dön" : "Back to products"}
        </button>
      )}
    </div>
  );
}

function StepBadge({
  n,
  label,
  active,
  done,
  muted,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
  muted?: boolean;
}) {
  return (
    <li className={cn("flex items-center gap-2", muted && "opacity-60")}>
      <span
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition",
          done && "bg-emerald-500 border-emerald-500 text-white",
          active && !done && "bg-accent-500 border-accent-500 text-white",
          !active && !done && "bg-white border-brand-200 text-brand-600",
        )}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </span>
      <span
        className={cn(
          "font-medium",
          active || done ? "text-brand-950" : "text-brand-600",
        )}
      >
        {label}
      </span>
    </li>
  );
}

function PickerPanel({
  locale,
  filtered,
  categories,
  activeCat,
  setActiveCat,
  query,
  setQuery,
  inBasket,
  toggleProduct,
}: {
  locale: Locale;
  filtered: PickerProduct[];
  categories: Array<{ slug: string; name: string; image: string | null }>;
  activeCat: string | "all";
  setActiveCat: (v: string | "all") => void;
  query: string;
  setQuery: (v: string) => void;
  inBasket: (id: number) => boolean;
  toggleProduct: (p: PickerProduct) => void;
}) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-5 lg:p-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-950">
          {locale === "tr" ? "Ürün seçin" : "Choose products"}
        </h2>
        <p className="text-sm text-brand-600 mt-0.5">
          {locale === "tr"
            ? "Ürüne tıklayarak listeye ekleyin. Tekrar tıklarsanız kaldırılır."
            : "Tap a product to add it. Tap again to remove."}
        </p>
      </div>

      <div className="mt-4 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locale === "tr" ? "Ürün ara (isim veya kod)…" : "Search (name or code)…"}
          className="form-input !pl-11 w-full"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCat("all")}
          className={pillClass(activeCat === "all")}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-200 text-brand-700 text-[10px] font-bold">
            ★
          </span>
          {locale === "tr" ? "Tümü" : "All"}
        </button>
        {categories.map((c) => {
          const active = activeCat === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActiveCat(c.slug)}
              className={pillClass(active)}
            >
              <span
                className={cn(
                  "relative inline-block w-6 h-6 rounded-full overflow-hidden ring-1",
                  active ? "ring-white/40" : "ring-brand-100",
                )}
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="w-full h-full grid place-items-center bg-brand-100 text-brand-500 text-[9px] font-semibold uppercase">
                    {c.name.slice(0, 2)}
                  </span>
                )}
              </span>
              {c.name}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-brand-600 text-center py-8">
          {locale === "tr" ? "Sonuç yok." : "No results."}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((p) => {
            const added = inBasket(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProduct(p)}
                className={cn(
                  "group text-left rounded-xl border overflow-hidden bg-white transition relative",
                  added
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-brand-100 hover:border-accent-500 hover:shadow-sm",
                )}
                aria-pressed={added}
              >
                <div className="relative aspect-square bg-gradient-to-br from-brand-100 to-brand-50">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name[locale]}
                      fill
                      sizes="(min-width: 1024px) 20vw, 40vw"
                      className={cn("object-cover transition", added && "opacity-95")}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-brand-300 font-display font-bold text-lg">
                      {p.code}
                    </div>
                  )}
                  {added && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] grid place-items-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow">
                        <Check className="h-3.5 w-3.5" />
                        {locale === "tr" ? "Listede" : "In list"}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute top-1.5 right-1.5 w-7 h-7 rounded-full grid place-items-center transition shadow",
                      added
                        ? "bg-emerald-500 text-white group-hover:bg-red-500"
                        : "bg-white/95 text-brand-700 group-hover:bg-accent-500 group-hover:text-white",
                    )}
                    aria-hidden
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 group-hover:hidden" />
                        <X className="h-4 w-4 hidden group-hover:block" />
                      </>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-accent-600 truncate">
                    {p.categoryName[locale]}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-brand-950 truncate">
                    {p.name[locale]}
                  </div>
                  <div className="text-[11px] text-brand-500 font-mono">{p.code}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function BasketPanel({
  locale,
  basket,
  onRemove,
  onUpdate,
  onClear,
  onSwitchToCustom,
  step,
  status,
  onContinue,
  onBack,
}: {
  locale: Locale;
  basket: CartItem[];
  onRemove: (key: string) => void;
  onUpdate: (key: string, patch: Partial<CartItem>) => void;
  onClear: () => void;
  onSwitchToCustom: () => void;
  step: Step;
  status: "idle" | "loading" | "success" | "error";
  onContinue: () => void;
  onBack: () => void;
}) {
  const tr = locale === "tr";
  const empty = basket.length === 0;
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="rounded-2xl border border-brand-100 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 bg-brand-950 text-white">
          <ShoppingCart className="h-5 w-5 text-accent-400" />
          <h3 className="text-lg font-bold flex-1 tracking-tight">
            {tr ? "Teklif Listesi" : "Quote List"}
          </h3>
          <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-accent-500 text-white text-sm font-bold">
            {basket.length}
          </span>
          {!empty && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/90 hover:bg-white/10 hover:border-white/40 transition"
              aria-label={tr ? "Seçimleri temizle" : "Clear selections"}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              {tr ? "Temizle" : "Clear"}
            </button>
          )}
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          {empty ? (
            <div className="px-5 py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-400 mb-3">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-sm text-brand-600 leading-relaxed">
                {tr ? (
                  <>
                    Listeniz boş. Sol taraftan ürün ekleyin veya özel talebiniz için{" "}
                    <button
                      type="button"
                      onClick={onSwitchToCustom}
                      className="font-semibold text-accent-600 underline underline-offset-2 hover:text-accent-700 transition"
                    >
                      Özel Talep
                    </button>{" "}
                    bölümünden talebinizi iletin.
                  </>
                ) : (
                  <>
                    List is empty. Add products from the left or use{" "}
                    <button
                      type="button"
                      onClick={onSwitchToCustom}
                      className="font-semibold text-accent-600 underline underline-offset-2 hover:text-accent-700 transition"
                    >
                      Custom Request
                    </button>{" "}
                    for a personalized quote.
                  </>
                )}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-brand-100">
              {basket.map((item) => (
                <li key={item.key} className="p-3 flex gap-3">
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white ring-1 ring-brand-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[10px] text-brand-400 font-mono">
                        {item.code}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {item.categoryName && (
                          <div className="text-[9px] font-semibold uppercase tracking-wide text-accent-600 truncate">
                            {item.categoryName}
                          </div>
                        )}
                        <div className="text-xs font-medium text-brand-950 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-brand-500 font-mono">{item.code}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.key)}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-accent-500 text-white hover:bg-accent-600 transition shrink-0"
                        aria-label={locale === "tr" ? "Kaldır" : "Remove"}
                        title={locale === "tr" ? "Ürünü kaldır" : "Remove"}
                      >
                        <X className="h-3 w-3" strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="mt-1.5">
                      {item.rollLength ? (
                        <RollCounter locale={locale} item={item} onUpdate={onUpdate} />
                      ) : (
                        <input
                          value={item.quantity ?? ""}
                          onChange={(e) => onUpdate(item.key, { quantity: e.target.value })}
                          placeholder={locale === "tr" ? "Miktar" : "Qty"}
                          className="form-input text-xs !py-1"
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-brand-100 bg-brand-50/60 p-4">
          {step === "select" ? (
            <div className="flex items-stretch gap-2">
              <Link
                href={`${localePrefix(locale)}/urunler`}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-brand-200 bg-white px-3 text-sm font-medium text-brand-700 hover:border-accent-500 hover:text-accent-600 transition"
                aria-label={locale === "tr" ? "Ürünlere dön" : "Back to products"}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === "tr" ? "Ürünlere dön" : "Back"}
                </span>
              </Link>
              <button
                type="button"
                onClick={onContinue}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition"
              >
                {locale === "tr" ? "Teklifi Tamamla" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-brand-200 bg-white px-3 text-sm font-medium text-brand-700 hover:border-accent-500 hover:text-accent-600 transition"
                aria-label={locale === "tr" ? "Ürünlere dön" : "Back to products"}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === "tr" ? "Ürünlere dön" : "Back"}
                </span>
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {locale === "tr"
                  ? status === "loading"
                    ? "Gönderiliyor…"
                    : "Talebi Tamamla"
                  : status === "loading"
                    ? "Sending…"
                    : "Complete Request"}
              </button>
            </div>
          )}
          <p className="mt-2 text-[11px] text-brand-500 text-center">
            {locale === "tr"
              ? "Boş liste ile de gönderebilirsiniz."
              : "You can also send with an empty basket."}
          </p>
        </div>
      </div>
    </aside>
  );
}

type RegisterFn = ReturnType<typeof useForm<ContactData>>["register"];
type ControlFn = ReturnType<typeof useForm<ContactData>>["control"];
type ErrorsMap = ReturnType<typeof useForm<ContactData>>["formState"]["errors"];

function ContactPanel({
  locale,
  dict,
  register,
  control,
  errors,
  status,
}: {
  locale: Locale;
  dict: Dictionary;
  register: RegisterFn;
  control: ControlFn;
  errors: ErrorsMap;
  status: "idle" | "loading" | "success" | "error";
}) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-5 lg:p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-brand-950">
          {locale === "tr" ? "İletişim bilgileri" : "Contact info"}
        </h2>
        <p className="text-sm text-brand-600 mt-0.5">
          {locale === "tr"
            ? "Size en kısa sürede dönüş yapabilmemiz için bilgilerinizi girin."
            : "So we can get back to you as soon as possible."}
        </p>
      </div>

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

      <Field label={dict.quote.fields.message} error={errors.message?.message}>
        <textarea
          {...register("message")}
          className="form-input min-h-32 resize-y"
          rows={5}
          placeholder={dict.quote.placeholders.message}
        />
      </Field>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          {dict.quote.error}
        </div>
      )}
    </section>
  );
}

function FormStyles() {
  return (
    <style jsx global>{`
      .form-input {
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
      .form-input:focus {
        border-color: var(--color-accent-500);
        box-shadow: 0 0 0 3px rgba(255, 107, 26, 0.15);
      }
    `}</style>
  );
}

function toCartFields(p: PickerProduct, locale: Locale): Omit<CartItem, "key"> {
  const rollLength = p.rollLength ?? null;
  const rollCount = rollLength ? 1 : null;
  const quantity = buildRollQuantity(rollCount, rollLength, locale);
  return {
    productId: p.id,
    code: p.code,
    name: p.name[locale],
    image: p.image ?? null,
    categoryName: p.categoryName[locale],
    categorySlug: p.categorySlug,
    slug: p.slug,
    quantity,
    note: "",
    rollLength,
    rollCount,
  };
}

function buildRollQuantity(
  count: number | null | undefined,
  length: number | null | undefined,
  locale: Locale,
): string {
  if (!count || !length) return "";
  const unit = locale === "tr" ? "MT" : "M";
  const roll = locale === "tr" ? "top" : "roll";
  return `${count} ${roll} × ${length} ${unit} = ${count * length} ${unit}`;
}

function RollCounter({
  locale,
  item,
  onUpdate,
}: {
  locale: Locale;
  item: CartItem;
  onUpdate: (key: string, patch: Partial<CartItem>) => void;
}) {
  const length = item.rollLength ?? 0;
  const count = item.rollCount ?? 1;
  const setCount = (next: number) => {
    const c = Math.max(1, Math.min(999, next || 1));
    onUpdate(item.key, {
      rollCount: c,
      quantity: buildRollQuantity(c, length, locale),
    });
  };
  const total = count * length;
  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <div className="inline-flex items-stretch h-8 rounded-md border border-brand-200 overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setCount(count - 1)}
          disabled={count <= 1}
          className="w-6 grid place-items-center text-brand-600 hover:bg-brand-50 hover:text-accent-600 disabled:opacity-40 disabled:pointer-events-none transition"
          aria-label={locale === "tr" ? "Azalt" : "Decrease"}
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
        <input
          type="number"
          min={1}
          max={999}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: `${Math.max(2.4, String(count).length * 0.7 + 1.6)}rem` }}
          className="no-spin border-x border-brand-200 text-sm !py-0 !px-1 text-center font-semibold text-brand-950 focus:border-accent-500 outline-none tabular-nums"
        />
        <button
          type="button"
          onClick={() => setCount(count + 1)}
          className="w-6 grid place-items-center text-brand-600 hover:bg-brand-50 hover:text-accent-600 transition"
          aria-label={locale === "tr" ? "Arttır" : "Increase"}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
      <span className="inline-flex items-center h-8 px-2 rounded-md bg-brand-50 text-xs font-medium text-brand-600 whitespace-nowrap tabular-nums">
        × {length} MT
      </span>
      <span className="inline-flex items-center h-8 text-xs font-bold text-accent-700 whitespace-nowrap tabular-nums">
        = {total} MT
      </span>
    </div>
  );
}

function pillClass(active: boolean) {
  return cn(
    "inline-flex items-center gap-2 rounded-full border pl-1 pr-3 py-1 text-xs font-medium transition",
    active
      ? "border-accent-500 bg-accent-500 text-white"
      : "border-brand-200 bg-white text-brand-700 hover:border-brand-300",
  );
}

function SuccessScreen({
  locale,
  variant = "catalog",
  onNewQuote,
  onSwitchToCustom,
  onSwitchToCatalog,
}: {
  locale: Locale;
  variant?: "catalog" | "custom";
  onNewQuote: () => void;
  onSwitchToCustom?: () => void;
  onSwitchToCatalog?: () => void;
}) {
  const tr = locale === "tr";
  const isCustom = variant === "custom";
  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 lg:p-12 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 text-white mb-6 shadow-lg shadow-emerald-500/30">
        <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">
        {tr ? "Teşekkürler!" : "Thank you!"}
      </h2>
      <p className="mt-3 text-base lg:text-lg text-brand-700 max-w-md mx-auto leading-relaxed">
        {tr
          ? isCustom
            ? "Özel ürün talebiniz alındı. En kısa sürede size ulaşacağız."
            : "Teklif talebiniz alındı. En kısa sürede size ulaşacağız."
          : isCustom
            ? "Your custom request has been received. We'll get back to you shortly."
            : "Your quote request has been received. We'll get back to you shortly."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`${localePrefix(locale)}/urunler`}
          className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-800 hover:border-brand-400 hover:text-brand-950 transition"
        >
          <Package className="h-4 w-4" />
          {tr ? "Ürünleri İncele" : "Browse Products"}
        </Link>
        <button
          type="button"
          onClick={onNewQuote}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition"
        >
          <Sparkles className="h-4 w-4" />
          {tr
            ? isCustom
              ? "Yeni Özel Ürün Talebi"
              : "Yeni Bir Teklif Oluştur"
            : isCustom
              ? "New Custom Request"
              : "Create Another Quote"}
        </button>
        {isCustom
          ? onSwitchToCatalog && (
              <button
                type="button"
                onClick={onSwitchToCatalog}
                className="inline-flex items-center gap-2 rounded-md border border-brand-950 bg-brand-950 hover:bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition"
              >
                <Package className="h-4 w-4" />
                {tr ? "Katalogdan Teklif Al" : "Get Catalog Quote"}
              </button>
            )
          : onSwitchToCustom && (
              <button
                type="button"
                onClick={onSwitchToCustom}
                className="inline-flex items-center gap-2 rounded-md border border-brand-950 bg-brand-950 hover:bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition"
              >
                <PenSquare className="h-4 w-4" />
                {tr ? "Özel Ürün Talebi Gönder" : "Send Custom Request"}
              </button>
            )}
      </div>
    </section>
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
      {label && (
        <span className="block text-sm font-medium text-brand-800 mb-1.5">
          {label}
          {required && <span className="text-accent-500 ml-0.5">*</span>}
        </span>
      )}
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
