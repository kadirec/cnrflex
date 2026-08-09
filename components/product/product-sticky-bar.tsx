"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Locale, localePrefix } from "@/lib/site";
import { AddToQuoteButton } from "@/components/product/add-to-quote-button";

type Props = {
  observeId: string;
  locale: Locale;
  productId: number;
  code: string;
  name: string;
  slug: string;
  image: string | null;
  categoryName: string;
  categorySlug: string;
  rollLength: number | null;
  quoteLabel: string;
  contactLabel: string;
};

export function ProductStickyBar({
  observeId,
  locale,
  productId,
  code,
  name,
  slug,
  image,
  categoryName,
  categorySlug,
  rollLength,
  quoteLabel,
  contactLabel,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(observeId);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeId]);

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-brand-100 shadow-[0_-4px_20px_rgb(0_0_0/0.06)] transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent-600 truncate">
            {code}
          </div>
          <div className="text-sm sm:text-base font-semibold text-brand-950 truncate">
            {name}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AddToQuoteButton
            locale={locale}
            productId={productId}
            code={code}
            name={name}
            image={image}
            slug={slug}
            categoryName={categoryName}
            categorySlug={categorySlug}
            rollLength={rollLength}
            label={quoteLabel}
          />
          <Link
            href={`${localePrefix(locale)}/iletisim`}
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-brand-100 hover:bg-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-900 transition"
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
