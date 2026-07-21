import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ChevronRight, ArrowUpRight } from "lucide-react";

import { getAllCategoriesFlat, getCategory } from "@/lib/products";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";
import { locales } from "@/lib/site";

export async function generateStaticParams() {
  const categories = await getAllCategoriesFlat();
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.slug })),
  );
}

export async function generateMetadata(props: PageProps<"/[locale]/urunler/[category]">): Promise<Metadata> {
  const { locale, category: categorySlug } = await props.params;
  if (!hasLocale(locale)) return {};
  const category = await getCategory(categorySlug);
  if (!category) return {};
  return {
    title: category.name[locale],
    description: category.shortDescription[locale],
  };
}

export default async function CategoryPage(props: PageProps<"/[locale]/urunler/[category]">) {
  const { locale, category: categorySlug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const category = await getCategory(categorySlug);
  if (!category) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-sm text-brand-600">
            <Link href={`/${locale}`} className="hover:text-accent-600">{dict.nav.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/urunler`} className="hover:text-accent-600">{dict.nav.products}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-900">{category.name[locale]}</span>
          </nav>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-brand-950">{category.name[locale]}</h1>
          <p className="mt-4 text-lg text-brand-700 max-w-3xl leading-relaxed">
            {category.description[locale]}
          </p>
        </div>
      </div>

      {category.children.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-950 mb-8">
              {locale === "tr" ? "Alt kategoriler" : "Sub-categories"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.children.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/${locale}/urunler/${sub.slug}`}
                  className="group flex flex-col rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-brand-100 overflow-hidden">
                    {sub.image && (
                      <Image
                        src={sub.image}
                        alt={sub.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                    <span className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30 text-white group-hover:bg-accent-500 group-hover:ring-accent-500 transition">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-brand-950">{sub.name[locale]}</h3>
                    <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1">
                      {sub.shortDescription[locale]}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                      {dict.categories.viewProducts}
                      <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {category.products.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            {category.children.length > 0 && (
              <h2 className="text-2xl lg:text-3xl font-bold text-brand-950 mb-8">
                {locale === "tr" ? "Ürünler" : "Products"}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <Link
                  key={product.code}
                  href={`/${locale}/urunler/${category.slug}/${product.slug}`}
                  className="group flex flex-col rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center">
                    <span className="font-display font-bold text-2xl text-brand-300">{product.code}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                      {product.code}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-brand-950">
                      {product.name[locale]}
                    </h3>
                    <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1">
                      {product.description[locale]}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                      {dict.common.viewDetails}
                      <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
