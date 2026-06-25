import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function ContactCTA({ locale, dict }: Props) {
  return (
    <section className="relative bg-brand-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold">{dict.quote.title}</h2>
            <p className="mt-4 text-lg text-brand-200 leading-relaxed">{dict.quote.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link
              href={`/${locale}/teklif-al`}
              className="group inline-flex items-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
            >
              {dict.nav.getQuote}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/iletisim`}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 backdrop-blur hover:bg-white/15 ring-1 ring-white/20 px-6 py-3 text-base font-semibold text-white transition"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
