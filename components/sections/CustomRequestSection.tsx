import { getAllCategoriesFlat } from "@/lib/products";
import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import { CustomRequestSectionClient } from "./CustomRequestSectionClient";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export async function CustomRequestSection({ locale, dict }: Props) {
  const categories = await getAllCategoriesFlat();
  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: `${"— ".repeat(c.depth)}${c.name[locale]}`,
  }));

  return <CustomRequestSectionClient locale={locale} dict={dict} categoryOptions={categoryOptions} />;
}
