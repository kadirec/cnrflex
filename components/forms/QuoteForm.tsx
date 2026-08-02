"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check,
  X,
  Search,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import type { PickerProduct } from "@/lib/products";
import { useQuoteCart, type CartItem } from "@/components/cart/QuoteCartContext";
import { cn } from "@/lib/utils";
import { PhoneField, PHONE_REGEX } from "./PhoneField";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(PHONE_REGEX),
  message: z.string().min(10),
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  locale: Locale;
  dict: Dictionary;
  products: PickerProduct[];
  prefillProductSlug?: string;
  prefillCategorySlug?: string;
};

type Step = "select" | "contact";

export function QuoteForm({
  locale,
  dict,
  products,
  prefillProductSlug,
  prefillCategorySlug,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep] = useState<Step>("select");
  const [activeCat, setActiveCat] = useState<string | "all">(prefillCategorySlug ?? "all");
  const [query, setQuery] = useState("");
  const cart = useQuoteCart();
  const prefillAppliedRef = useRef(false);

  useEffect(() => {
    if (!cart.hydrated || prefillAppliedRef.current || !prefillProductSlug) return;
    const p = products.find((x) => x.slug === prefillProductSlug);
    if (p && !cart.isInCart(p.id)) {
      cart.add(toCartFields(p, locale));
    }
    prefillAppliedRef.current = true;
  }, [cart, prefillProductSlug, products, locale]);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (!seen.has(p.categorySlug)) seen.set(p.categorySlug, p.categoryName[locale]);
    }
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });

  const toggleProduct = (p: PickerProduct) => {
    cart.toggle(p.id, toCartFields(p, locale));
  };

  const onSubmit = async (data: FormData) => {
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

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 8000);
      return () => clearTimeout(t);
    }
  }, [status]);

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
          step={step}
          status={status}
          onContinue={() => setStep("contact")}
        />
      </div>

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
  categories: Array<{ slug: string; name: string }>;
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
            ? "Ürüne tıklayarak sepete ekleyin. Tekrar tıklarsanız kaldırılır."
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
        <button type="button" onClick={() => setActiveCat("all")} className={pillClass(activeCat === "all")}>
          {locale === "tr" ? "Tümü" : "All"}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCat(c.slug)}
            className={pillClass(activeCat === c.slug)}
          >
            {c.name}
          </button>
        ))}
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
                        {locale === "tr" ? "Sepette" : "In basket"}
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
  step,
  status,
  onContinue,
}: {
  locale: Locale;
  basket: CartItem[];
  onRemove: (key: string) => void;
  onUpdate: (key: string, patch: Partial<CartItem>) => void;
  step: Step;
  status: "idle" | "loading" | "success" | "error";
  onContinue: () => void;
}) {
  const empty = basket.length === 0;
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="rounded-2xl border border-brand-100 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 bg-brand-950 text-white">
          <ShoppingCart className="h-4 w-4 text-accent-400" />
          <h3 className="text-sm font-semibold flex-1">
            {locale === "tr" ? "Teklif sepeti" : "Quote basket"}
          </h3>
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-accent-500 text-white text-xs font-bold">
            {basket.length}
          </span>
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          {empty ? (
            <div className="px-5 py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-400 mb-3">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-sm text-brand-600">
                {locale === "tr"
                  ? "Sepetiniz boş. Sol taraftan ürün ekleyin veya doğrudan devam edin."
                  : "Basket is empty. Add products or continue without."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-brand-100">
              {basket.map((item) => (
                <li key={item.key} className="p-3 flex gap-3">
                  <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-brand-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[9px] text-brand-400 font-mono">
                        {item.code}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
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
                        className="text-brand-400 hover:text-red-600 transition"
                        aria-label={locale === "tr" ? "Kaldır" : "Remove"}
                      >
                        <X className="h-3.5 w-3.5" />
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
            <button
              type="button"
              onClick={onContinue}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition"
            >
              {locale === "tr" ? "Teklifi Tamamla" : "Continue"}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {locale === "tr"
                ? status === "loading"
                  ? "Gönderiliyor…"
                  : "Teklif Talebini Gönder"
                : status === "loading"
                  ? "Sending…"
                  : "Send Quote Request"}
            </button>
          )}
          <p className="mt-2 text-[11px] text-brand-500 text-center">
            {locale === "tr"
              ? "Boş sepet ile de gönderebilirsiniz."
              : "You can also send with an empty basket."}
          </p>
        </div>
      </div>
    </aside>
  );
}

type RegisterFn = ReturnType<typeof useForm<FormData>>["register"];
type ControlFn = ReturnType<typeof useForm<FormData>>["control"];
type ErrorsMap = ReturnType<typeof useForm<FormData>>["formState"]["errors"];

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

      <Field label={dict.quote.fields.message} required error={errors.message?.message}>
        <textarea
          {...register("message")}
          className="form-input min-h-32 resize-y"
          rows={5}
          placeholder={dict.quote.placeholders.message}
        />
      </Field>

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
    <div className="space-y-1">
      <div className="flex items-stretch gap-1">
        <button
          type="button"
          onClick={() => setCount(count - 1)}
          disabled={count <= 1}
          className="w-7 rounded-md border border-brand-200 text-brand-700 hover:border-accent-500 disabled:opacity-40 grid place-items-center text-xs"
          aria-label="-"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={999}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="form-input text-xs !py-1 text-center flex-1"
        />
        <button
          type="button"
          onClick={() => setCount(count + 1)}
          className="w-7 rounded-md border border-brand-200 text-brand-700 hover:border-accent-500 grid place-items-center text-xs"
          aria-label="+"
        >
          +
        </button>
        <span className="inline-flex items-center px-2 rounded-md bg-brand-50 border border-brand-100 text-[10px] font-medium text-brand-700 whitespace-nowrap">
          × {length} MT
        </span>
      </div>
      <div className="text-[10px] font-semibold text-accent-700 text-right">
        = {total} MT
      </div>
    </div>
  );
}

function pillClass(active: boolean) {
  return cn(
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
    active
      ? "border-accent-500 bg-accent-500 text-white"
      : "border-brand-200 bg-white text-brand-700 hover:border-brand-300",
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
