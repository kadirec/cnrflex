import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";

import { getAllCategories, getProduct } from "@/lib/products";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { locales } from "@/lib/site";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return locales.flatMap((locale) =>
    categories.flatMap((category) =>
      category.products.map((product) => ({
        locale,
        category: category.slug,
        product: product.slug,
      })),
    ),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/urunler/[category]/[product]">,
): Promise<Metadata> {
  const { locale, category: catSlug, product: prodSlug } = await props.params;
  if (!hasLocale(locale)) return {};
  const result = await getProduct(catSlug, prodSlug);
  if (!result) return {};
  return {
    title: result.product.name[locale],
    description: result.product.description[locale],
  };
}

export default async function ProductPage(
  props: PageProps<"/[locale]/urunler/[category]/[product]">,
) {
  const { locale, category: catSlug, product: prodSlug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const result = await getProduct(catSlug, prodSlug);
  if (!result) notFound();
  const { category, product } = result;
  const dict = await getDictionary(locale);

  const features = locale === "tr"
    ? ["Yüksek dayanım ve uzun ömür", "Hava ve su sızdırmazlığı", "Sessiz çalışma performansı", "Esnek özel ölçü ve renk seçenekleri"]
    : ["High durability and long service life", "Air and water-tight sealing", "Silent operation performance", "Flexible custom size and color options"];

  return (
    <>
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-brand-600 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-accent-600">{dict.nav.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/urunler`} className="hover:text-accent-600">{dict.nav.products}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/urunler/${category.slug}`} className="hover:text-accent-600">{category.name[locale]}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-900">{product.name[locale]}</span>
          </nav>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center">
              <span className="font-display font-bold text-5xl text-brand-300">{product.code}</span>
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                {product.code}
              </div>
              <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-brand-950">
                {product.name[locale]}
              </h1>
              <p className="mt-5 text-lg text-brand-700 leading-relaxed">
                {product.description[locale]}
              </p>

              <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent-500 mt-0.5 shrink-0" />
                    <span className="text-brand-800">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/teklif-al?category=${encodeURIComponent(category.slug)}`}
                  className="group inline-flex items-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
                >
                  {dict.nav.getQuote}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/iletisim`}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-100 hover:bg-brand-200 px-6 py-3 text-base font-semibold text-brand-900 transition"
                >
                  {dict.nav.contact}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-50 border-t border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">
            {locale === "tr" ? "Aynı kategoriden diğer ürünler" : "Other products in the same category"}
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {category.products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.code}
                  href={`/${locale}/urunler/${category.slug}/${p.slug}`}
                  className="group rounded-xl bg-white border border-brand-100 p-5 hover:border-accent-500 hover:shadow-lg transition"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent-600">{p.code}</div>
                  <h3 className="mt-2 text-sm font-semibold text-brand-950">{p.name[locale]}</h3>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
