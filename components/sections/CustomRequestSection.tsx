import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import { CustomRequestSectionClient } from "./CustomRequestSectionClient";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function CustomRequestSection({ locale, dict }: Props) {
  return <CustomRequestSectionClient locale={locale} dict={dict} />;
}
