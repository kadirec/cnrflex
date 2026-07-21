import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Hero({ locale, dict }: Props) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <Image
        src="/cnr_flex_hero2.png"
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-white/20">
            <Sparkles className="h-4 w-4 text-accent-400" />
            {dict.hero.eyebrow}
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {dict.hero.title}
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-brand-200 leading-relaxed max-w-2xl">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/teklif-al`}
              className="group inline-flex items-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
            >
              {dict.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/urunler`}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 backdrop-blur hover:bg-white/15 ring-1 ring-white/20 px-6 py-3 text-base font-semibold text-white transition"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
