"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteCart } from "@/components/cart/QuoteCartContext";
import { type Locale, localePrefix } from "@/lib/site";

type Props = {
  locale: Locale;
  variant?: "desktop" | "mobile";
};

export function CartMenu({ locale, variant = "desktop" }: Props) {
  const { items, count, hydrated, remove } = useQuoteCart();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const label = locale === "tr" ? "Teklif Listesi" : "Quote List";
  const empty = count === 0;

  const desktopPill = (
    <button
      type="button"
      onClick={() => (empty ? undefined : setOpen((v) => !v))}
      aria-label={label}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border px-3 h-9 text-sm font-medium transition",
        empty
          ? "border-brand-200 bg-white text-brand-700 hover:border-brand-300"
          : "border-accent-500 bg-accent-50 text-accent-700 hover:bg-accent-100",
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      <span>{label}</span>
      {hydrated && count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-500 text-white text-[10px] font-bold">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );

  const mobileIcon = (
    <button
      type="button"
      onClick={() => (empty ? undefined : setOpen((v) => !v))}
      aria-label={label}
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-md text-brand-800 hover:bg-brand-50 transition"
    >
      <ShoppingCart className="h-5 w-5" />
      {hydrated && count > 0 && (
        <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent-500 text-white text-[10px] font-bold ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );

  const iconButton = variant === "desktop" ? desktopPill : mobileIcon;

  if (empty) {
    return (
      <Link
        href={`${localePrefix(locale)}/teklif-al`}
        aria-label={label}
        className={
          variant === "desktop"
            ? "inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white h-9 px-3 text-sm font-medium text-brand-700 hover:border-brand-300 transition"
            : "relative inline-flex items-center justify-center h-10 w-10 rounded-md text-brand-800 hover:bg-brand-50 transition"
        }
      >
        <ShoppingCart className={variant === "desktop" ? "h-4 w-4" : "h-5 w-5"} />
        {variant === "desktop" && <span>{label}</span>}
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {iconButton}

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[340px] rounded-xl border border-brand-100 bg-white shadow-xl overflow-hidden",
            variant === "desktop" ? "right-0" : "right-0",
          )}
          role="dialog"
          aria-label={label}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-brand-950 text-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-accent-400" />
              <span className="text-sm font-semibold">{label}</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-500 text-white text-[10px] font-bold">
                {count}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white"
              aria-label={locale === "tr" ? "Kapat" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="max-h-[360px] overflow-y-auto divide-y divide-brand-100">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3 p-3">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white ring-1 ring-brand-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
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
                      <div className="text-xs font-medium text-brand-950 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-brand-500 font-mono">{item.code}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-accent-500 text-white hover:bg-accent-600 transition shrink-0"
                      aria-label={locale === "tr" ? "Kaldır" : "Remove"}
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </div>
                  {item.quantity && (
                    <div className="mt-1 text-[10px] text-brand-600">{item.quantity}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-brand-100 bg-brand-50/60 p-3">
            <Link
              href={`${localePrefix(locale)}/teklif-al`}
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition"
            >
              {locale === "tr" ? "Teklifi Tamamla" : "Complete Quote"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
