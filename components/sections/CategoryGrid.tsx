import Link from "next/link";
import { ArrowUpRight, Boxes, Square, Wind, DoorOpen, Tent, Lightbulb, Footprints } from "lucide-react";

import { categories } from "@/content/products";
import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
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

export function CategoryGrid({ locale, dict }: Props) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-950">{dict.categories.title}</h2>
          <p className="mt-4 text-lg text-brand-700">{dict.categories.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.slug] ?? Boxes;
            return (
              <Link
                key={category.slug}
                href={`/${locale}/urunler/${category.slug}`}
                className="group relative flex flex-col rounded-xl border border-brand-100 bg-white p-6 hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition"
              >
                <div className="flex items-start justify-between">
                  <span className="grid place-items-center h-12 w-12 rounded-lg bg-brand-100 text-brand-900 group-hover:bg-accent-500 group-hover:text-white transition">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-brand-300 group-hover:text-accent-500 transition" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-brand-950">{category.name[locale]}</h3>
                <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1">
                  {category.shortDescription[locale]}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                  {dict.categories.viewProducts}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
