import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getDictionary, hasLocale } from "../dictionaries";

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

  return (
    <>
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-950">{dict.nav.products}</h1>
          <p className="mt-4 text-lg text-brand-700 max-w-2xl">{dict.categories.subtitle}</p>
        </div>
      </div>
      <CategoryGrid locale={locale} dict={dict} />
      <ContactCTA locale={locale} dict={dict} />
    </>
  );
}
