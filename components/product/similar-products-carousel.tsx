"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { stripHtml } from "@/lib/sanitize";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { RollIcon } from "@/components/product/roll-icon";
import { type Locale, localePrefix } from "@/lib/site";
import type { Product, Category } from "@/lib/products";

type Props = {
  locale: Locale;
  category: Pick<Category, "slug" | "name">;
  products: Product[];
  viewDetailsLabel: string;
};

const AUTOPLAY_INTERVAL_MS = 4500;

export function SimilarProductsCarousel({
  locale,
  category,
  products,
  viewDetailsLabel,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [paused, setPaused] = useState(false);

  const updateNav = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateNav();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  const stepBy = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    setPaused(true);
    stepBy(dir);
  };

  useEffect(() => {
    if (paused || products.length <= 1) return;
    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        stepBy(1);
      }
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, products.length, stepBy]);

  return (
    <div className="relative">
      <div className="absolute right-0 -top-14 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          aria-label={locale === "tr" ? "Önceki" : "Previous"}
          className="grid place-items-center h-10 w-10 rounded-full bg-white border border-brand-200 text-brand-900 hover:border-accent-500 hover:text-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          aria-label={locale === "tr" ? "Sonraki" : "Next"}
          className="grid place-items-center h-10 w-10 rounded-full bg-white border border-brand-200 text-brand-900 hover:border-accent-500 hover:text-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 no-scrollbar"
      >
        {products.map((p) => (
          <article
            key={p.code}
            data-card
            className="group relative flex flex-col shrink-0 snap-start rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden w-[80%] sm:w-[calc((100%-1.2*1.5rem)/2.2)] lg:w-[calc((100%-2.5*1.5rem)/3.5)]"
          >
            <Link
              href={`${localePrefix(locale)}/urunler/${category.slug}/${p.slug}`}
              className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center overflow-hidden"
            >
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name[locale]}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                  className="object-cover transition group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <span className="font-display font-bold text-2xl text-brand-300">{p.code}</span>
              )}
            </Link>
            <div className="absolute top-2.5 right-2.5 z-10">
              <QuickAddButton
                locale={locale}
                productId={p.id}
                code={p.code}
                name={p.name[locale]}
                image={p.image ?? null}
                slug={p.slug}
                categoryName={category.name[locale]}
                categorySlug={category.slug}
                rollLength={p.rollLength ?? null}
              />
            </div>
            <Link
              href={`${localePrefix(locale)}/urunler/${category.slug}/${p.slug}`}
              className="p-5 flex-1 flex flex-col"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                  {p.code}
                </div>
                {p.rollLength && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                    <RollIcon className="w-3 h-3 text-accent-600" />
                    {p.rollLength} MT
                  </span>
                )}
              </div>
              <h3 className="mt-1 text-base font-semibold text-brand-950">{p.name[locale]}</h3>
              <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1 line-clamp-3">
                {stripHtml(p.description[locale])}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                {viewDetailsLabel}
                <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
