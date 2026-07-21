import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Boxes, Square, Wind, DoorOpen, Tent, Lightbulb, Footprints } from "lucide-react";

import { getAllCategories } from "@/lib/products";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../dictionaries";

const iconMap: Record<string, typeof Boxes> = {
  "otomatik-kepenk-fitilleri": Boxes,
  "pergola-fitilleri": Square,
  "biyoklimatik-fitiller": Wind,
  "kapi-fitilleri": DoorOpen,
  "tente-fitil-profilleri": Tent,
  "lightbox-fitilleri": Lightbulb,
  "paspas-profilleri": Footprints,
};

export async function generateMetadata(props: PageProps<"/[locale]/urunler">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.nav.products,
    description: dict.categories.subtitle,
  };
}

export default async function ProductsPage(props: PageProps<"/[locale]/urunler">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const categories = await getAllCategories();

  return (
    <>
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-950">{dict.nav.products}</h1>
          <p className="mt-4 text-lg text-brand-700 max-w-2xl">{dict.categories.subtitle}</p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.slug] ?? Boxes;
              return (
                <Link
                  key={category.slug}
                  href={`/${locale}/urunler/${category.slug}`}
                  className="group flex flex-col rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-brand-100 overflow-hidden">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
