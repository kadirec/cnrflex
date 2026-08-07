import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight } from "lucide-react";

import { getProduct } from "@/lib/products";
import { stripHtml } from "@/lib/sanitize";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToQuoteButton } from "@/components/product/add-to-quote-button";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { RollIcon } from "@/components/product/roll-icon";
import { ProductStickyBar } from "@/components/product/product-sticky-bar";
import { getDictionary, hasLocale } from "../../../dictionaries";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/[locale]/urunler/[category]/[product]">,
): Promise<Metadata> {
  const { locale, category: catSlug, product: prodSlug } = await props.params;
  if (!hasLocale(locale)) return {};
  const result = await getProduct(catSlug, prodSlug);
  if (!result) return {};
  return {
    title: result.product.name[locale],
    description: stripHtml(result.product.description[locale]).slice(0, 200),
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

  const similar = category.products.filter((p) => p.slug !== product.slug);

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div id="product-info-bar" className="relative">
            <ProductGallery
              images={product.images}
              alt={product.name[locale]}
              fallbackCode={product.code}
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4 lg:p-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="pointer-events-auto rounded-2xl bg-white/90 backdrop-blur px-4 py-3 lg:px-5 lg:py-4 ring-1 ring-brand-100 shadow-sm max-w-full lg:max-w-[60%]">
                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-600">
                  {product.code}
                </div>
                <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-brand-950 leading-tight">
                  {product.name[locale]}
                </h1>
                {product.rollLength && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs">
                    <RollIcon className="w-3.5 h-3.5 text-accent-600" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">
                      {locale === "tr" ? "Top Sarımı" : "Roll Length"}
                    </span>
                    <span className="text-brand-950 font-semibold">
                      {product.rollLength} MT
                    </span>
                  </div>
                )}
              </div>

              <div className="pointer-events-auto flex flex-wrap gap-2 lg:gap-3 lg:justify-end lg:shrink-0">
                <AddToQuoteButton
                  locale={locale}
                  productId={product.id}
                  code={product.code}
                  name={product.name[locale]}
                  image={product.image ?? null}
                  slug={product.slug}
                  categoryName={category.name[locale]}
                  categorySlug={category.slug}
                  rollLength={product.rollLength ?? null}
                  label={dict.nav.getQuote}
                />
                <Link
                  href={`/${locale}/iletisim`}
                  className="inline-flex items-center gap-2 rounded-md bg-white/95 backdrop-blur ring-1 ring-brand-200 hover:bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-sm transition"
                >
                  {dict.nav.contact}
                </Link>
              </div>
            </div>
          </div>

          {product.description[locale] && (
            <div className="mt-10 border-t border-brand-100 pt-8">
              <h2 className="text-lg font-semibold text-brand-950 mb-4">
                {locale === "tr" ? "Açıklama" : "Description"}
              </h2>
              <div
                className="prose-content max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description[locale] }}
              />
            </div>
          )}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-brand-50 border-t border-brand-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">
              {locale === "tr" ? "Benzer Ürünler" : "Similar Products"}
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => (
                <div
                  key={p.code}
                  className="group relative flex flex-col rounded-xl border border-brand-100 bg-white hover:border-accent-500 hover:shadow-lg hover:shadow-brand-900/5 transition overflow-hidden"
                >
                  <Link
                    href={`/${locale}/urunler/${category.slug}/${p.slug}`}
                    className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 grid place-items-center overflow-hidden"
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name[locale]}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                    href={`/${locale}/urunler/${category.slug}/${p.slug}`}
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
                    <h3 className="mt-1 text-base font-semibold text-brand-950">
                      {p.name[locale]}
                    </h3>
                    <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1 line-clamp-3">
                      {stripHtml(p.description[locale])}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-accent-600">
                      {dict.common.viewDetails}
                      <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CustomRequestSection locale={locale} dict={dict} />

      <ProductStickyBar
        observeId="product-info-bar"
        locale={locale}
        productId={product.id}
        code={product.code}
        name={product.name[locale]}
        slug={product.slug}
        image={product.image ?? null}
        categoryName={category.name[locale]}
        categorySlug={category.slug}
        rollLength={product.rollLength ?? null}
        quoteLabel={dict.nav.getQuote}
        contactLabel={dict.nav.contact}
      />
    </>
  );
}
