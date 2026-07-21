import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, FileText, CheckCircle2 } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata(props: PageProps<"/[locale]/katalog">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.catalog };
}

export default async function CatalogPage(props: PageProps<"/[locale]/katalog">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const items = locale === "tr" ? [
    "Tüm ürün kategorilerinin teknik detayları",
    "Kesit ölçüleri, sertlik (Shore A) ve renk seçenekleri",
    "Uygulama alanı ve montaj rehberi",
    "Sipariş için ürün kodu listesi",
  ] : [
    "Technical details for all product categories",
    "Cross-section dimensions, hardness (Shore A) and color options",
    "Application areas and installation guide",
    "Product code list for ordering",
  ];

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold">{dict.nav.catalog}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">
            {locale === "tr"
              ? "Tüm ürünlerimizin teknik detaylarını içeren PDF kataloğumuzu indirin veya size e-posta ile gönderelim."
              : "Download our PDF catalog containing technical details of all our products, or have us send it by email."}
          </p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="rounded-2xl bg-brand-50 p-8">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-14 w-14 rounded-xl bg-accent-500 text-white">
                    <FileText className="h-7 w-7" />
                  </span>
                  <div>
                    <div className="text-sm text-brand-600">
                      {locale === "tr" ? "CNR Seal Ürün Kataloğu" : "CNR Seal Product Catalog"}
                    </div>
                    <div className="text-lg font-bold text-brand-950">
                      {locale === "tr" ? "2026 Edisyonu — PDF" : "2026 Edition — PDF"}
                    </div>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-800">
                      <CheckCircle2 className="h-5 w-5 text-accent-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="/catalog/cnrseal-katalog.pdf"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-900 hover:bg-brand-800 px-6 py-3 text-base font-semibold text-white transition"
                  download
                >
                  <Download className="h-4 w-4" />
                  {dict.common.downloadCatalog}
                </a>
                <p className="mt-3 text-xs text-brand-600">
                  {locale === "tr"
                    ? "Katalog dosyası henüz yüklenmediyse, sağdaki formu doldurun — e-posta ile gönderelim."
                    : "If the catalog file is not yet available, fill out the form on the right — we'll send it by email."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-brand-50 p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-brand-950">
                {locale === "tr" ? "Kataloğu E-posta ile İste" : "Request Catalog by Email"}
              </h2>
              <p className="mt-2 text-sm text-brand-700">
                {locale === "tr"
                  ? "İletişim bilgilerinizi bırakın, güncel kataloğumuzu size ileteceğiz."
                  : "Leave your contact info — we'll send the latest catalog."}
              </p>
              <ContactForm locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
