import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, hasLocale } from "../dictionaries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[locale]/kullanim-sartlari">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.footer.terms };
}

export default async function TermsPage(props: PageProps<"/[locale]/kullanim-sartlari">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold">{dict.footer.terms}</h1>
        </div>
      </div>

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content">
          {locale === "tr" ? (
            <>
              <p>Bu kullanım şartları, {siteConfig.name} web sitesini kullanırken uymanız gereken kuralları belirler.</p>
              <h2>Kabul</h2>
              <p>Bu siteyi kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>
              <h2>Fikri Mülkiyet</h2>
              <p>Sitedeki tüm logolar, görseller ve metinler {siteConfig.name}&apos;e aittir. İzinsiz çoğaltılamaz.</p>
              <h2>Sorumluluk</h2>
              <p>Site içerikleri bilgilendirme amaçlıdır; ürün ve hizmet detayları için satış ekibimizle iletişime geçilmelidir.</p>
              <h2>Değişiklikler</h2>
              <p>Bu şartlar önceden bildirim yapılmaksızın güncellenebilir.</p>
              <p className="text-sm">Bu metin örnek niteliğindedir; nihai metin için hukuk danışmanı görüşü alınmalıdır.</p>
            </>
          ) : (
            <>
              <p>These terms set out the rules for using the {siteConfig.name} website.</p>
              <h2>Acceptance</h2>
              <p>By using this site, you accept the terms below.</p>
              <h2>Intellectual Property</h2>
              <p>All logos, images and text on the site belong to {siteConfig.name}. They may not be reproduced without permission.</p>
              <h2>Liability</h2>
              <p>Site content is for informational purposes; contact our sales team for product and service details.</p>
              <h2>Changes</h2>
              <p>These terms may be updated without prior notice.</p>
              <p className="text-sm">This text is a sample; obtain legal counsel for the final version.</p>
            </>
          )}
        </div>
      </article>
    </>
  );
}
