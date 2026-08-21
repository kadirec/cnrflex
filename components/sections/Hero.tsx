import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { type Locale, localePrefix } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: Props) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white min-h-[calc(100svh-5rem)] lg:min-h-0 flex">
      <Image
        src="/hero_slider.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-brand-950/45 to-brand-950/10 pointer-events-none" />
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-500 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-brand-500 blur-3xl" />
      </div>

      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-32 flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-sm font-medium text-brand-100 ring-1 ring-white/20 whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-accent-400" />
            <span className="sm:hidden">{dict.hero.eyebrowShort}</span>
            <span className="hidden sm:inline">{dict.hero.eyebrow}</span>
          </div>
          <h1 className="mt-5 sm:mt-6 text-[32px] leading-[1.15] sm:text-4xl sm:leading-tight lg:text-6xl font-bold">
            {dict.hero.title}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-brand-200 leading-relaxed max-w-2xl">
            {dict.hero.subtitle}
          </p>
          <div className="mt-7 sm:mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`${localePrefix(locale)}/teklif-al`}
              className="group inline-flex items-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-[15px] sm:text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
            >
              {dict.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href={`${localePrefix(locale)}/urunler`}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 backdrop-blur hover:bg-white/15 ring-1 ring-white/20 px-6 py-3 text-[15px] sm:text-base font-semibold text-white transition"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
