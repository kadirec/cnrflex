import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { getProduct } from "@/lib/products";
import { stripHtml } from "@/lib/sanitize";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToQuoteButton } from "@/components/product/add-to-quote-button";
import { SimilarProductsCarousel } from "@/components/product/similar-products-carousel";
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
          <div
            id="product-info-bar"
            className="mb-8 lg:mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                {product.code}
              </div>
              <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-brand-950 leading-tight">
                {product.name[locale]}
              </h1>
              {product.rollLength && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3.5 py-1.5 text-sm">
                  <RollIcon className="w-4 h-4 text-accent-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
                    {locale === "tr" ? "Top Sarımı" : "Roll Length"}
                  </span>
                  <span className="text-brand-950 font-semibold">
                    {product.rollLength} MT
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end lg:shrink-0">
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
                className="inline-flex items-center gap-2 rounded-md bg-brand-100 hover:bg-brand-200 px-6 py-3 text-base font-semibold text-brand-900 transition"
              >
                {dict.nav.contact}
              </Link>
            </div>
          </div>

          <ProductGallery
            images={product.images}
            alt={product.name[locale]}
            fallbackCode={product.code}
          />

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
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">
                {locale === "tr" ? "Benzer Ürünler" : "Similar Products"}
              </h2>
            </div>
            <SimilarProductsCarousel
              locale={locale}
              category={category}
              products={similar}
              viewDetailsLabel={dict.common.viewDetails}
            />
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
