import { notFound } from "next/navigation";

import { Hero } from "@/components/sections/Hero";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";

import { getDictionary, hasLocale } from "./dictionaries";
import { getAllCategories } from "@/lib/products";

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const categories = await getAllCategories();

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <StatsCounter dict={dict} />
      <CategoryGrid locale={locale} dict={dict} categories={categories} />
      <AboutPreview locale={locale} dict={dict} />
      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
