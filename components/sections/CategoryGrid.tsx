"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  Square,
  Wind,
  DoorOpen,
  Tent,
  Lightbulb,
  Footprints,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type CategoryCard = {
  slug: string;
  name: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  image?: string | null;
};

type Props = {
  locale: Locale;
  dict: Dictionary;
  categories: CategoryCard[];
};

const iconMap: Record<string, typeof Boxes> = {
  "otomatik-kepenk-fitilleri": Boxes,
  "pergola-fitilleri": Square,
  "biyoklimatik-fitiller": Wind,
  "kapi-fitilleri": DoorOpen,
  "tente-fitil-profilleri": Tent,
  "lightbox-fitilleri": Lightbulb,
  "paspas-profilleri": Footprints,
};

export function CategoryGrid({ locale, dict, categories }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const step = firstCard ? firstCard.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-950">{dict.categories.title}</h2>
            <p className="mt-4 text-lg text-brand-700">{dict.categories.subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Previous"
              className="grid place-items-center h-11 w-11 rounded-full border border-brand-200 bg-white text-brand-800 hover:border-accent-500 hover:text-accent-600 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-brand-200 disabled:hover:text-brand-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Next"
              className="grid place-items-center h-11 w-11 rounded-full border border-brand-200 bg-white text-brand-800 hover:border-accent-500 hover:text-accent-600 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-brand-200 disabled:hover:text-brand-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.slug] ?? Boxes;
            return (
              <Link
                key={category.slug}
                data-card
                href={`/${locale}/urunler/${category.slug}`}
                className="group snap-start shrink-0 basis-[78%] sm:basis-[48%] lg:basis-[28%] flex flex-col rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-brand-100 overflow-hidden">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name[locale]}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 28vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 grid place-items-center h-11 w-11 rounded-lg bg-white/95 backdrop-blur text-brand-900 group-hover:bg-accent-500 group-hover:text-white transition shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30 text-white group-hover:bg-accent-500 group-hover:ring-accent-500 transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-brand-950">{category.name[locale]}</h3>
                  <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1">
                    {category.shortDescription[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                    {dict.categories.viewProducts}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
