import Link from "next/link";
import { ShieldCheck, Truck, Headphones, ArrowRight } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function AboutPreview({ locale, dict }: Props) {
  const features = [
    { icon: ShieldCheck, key: "quality" as const },
    { icon: Truck, key: "delivery" as const },
    { icon: Headphones, key: "support" as const },
  ];

  return (
    <section className="bg-brand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-accent-600">
            {dict.about.eyebrow}
          </div>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-brand-950">{dict.about.title}</h2>
          <p className="mt-5 text-lg text-brand-700 leading-relaxed">{dict.about.lead}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className="rounded-xl bg-white p-6 border border-brand-100">
              <span className="grid place-items-center h-12 w-12 rounded-lg bg-accent-500 text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-brand-950">
                {dict.about.features[key].title}
              </h3>
              <p className="mt-2 text-sm text-brand-700 leading-relaxed">
                {dict.about.features[key].description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href={`/${locale}/kurumsal/hakkimizda`}
            className="group inline-flex items-center gap-2 rounded-md bg-brand-900 hover:bg-brand-800 px-6 py-3 text-base font-semibold text-white transition"
          >
            {dict.about.cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
