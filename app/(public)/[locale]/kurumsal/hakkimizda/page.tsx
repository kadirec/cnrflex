import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatsCounter } from "@/components/sections/StatsCounter";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";
import { buildAlternates, canonicalUrl } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/[locale]/kurumsal/hakkimizda">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.nav.about,
    alternates: buildAlternates(locale, "/kurumsal/hakkimizda"),
    openGraph: { url: canonicalUrl(locale, "/kurumsal/hakkimizda") },
  };
}

export default async function AboutPage(props: PageProps<"/[locale]/kurumsal/hakkimizda">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const content = locale === "tr" ? {
    heroTitle: "Teknik Fitil ve Ekstrüzyon Profillerinde Güvenilir Teknik Çözümler",
    heroLead:
      "CNR SEAL, teknik fitil ve ekstrüzyon profilleri alanında uzmanlaşmış; müşterilerinin üretim süreçlerini doğru analiz ederek ihtiyaçlarına özel, doğru malzeme, doğru üretim yöntemi ve doğru çözümleri bir araya getiren, üretim süreçlerine değer katan güvenilir bir çözüm markasıdır.",
    sections: [
      {
        title: "Sektöre Yolculuğumuz",
        body: "2010 yılında teknik plastik ve sızdırmazlık ürünlerinin ithalatıyla başlayan sektör yolculuğumuz, değişen ve gelişen Türk sanayisinin ihtiyaçlarını yakından takip ederek bugün teknik fitil ve ekstrüzyon profilleri alanında uzmanlaşan CNR SEAL markasına dönüşmüştür.",
      },
      {
        title: "Yerli Üretim ve Sürdürülebilir Çözümler",
        body: "Sektörde edindiğimiz ticari ve teknik deneyim doğrultusunda, üreticilerimizin yalnızca ithal ürünlere bağımlı kalmadan; yerli üretim gücü, doğru hammadde seçimi ve güvenilir üretim teknolojileriyle sürdürülebilir çözümlere ulaşmasını hedefliyoruz.",
      },
      {
        title: "Özel Profil Geliştirme ve Kalıp Tasarımı",
        body: "Bu doğrultuda standart ürün tedariğinin yanı sıra, teknik çizim veya numuneye göre özel profil geliştirme, kalıp tasarımı ve fason üretim süreçlerini yönetiyor; üretim sürecinin ihtiyaç duyduğu doğru malzemeyi, doğru üretim yöntemini ve doğru çözüm kaynaklarını bir araya getiriyoruz.",
      },
      {
        title: "Projelere Yaklaşımımız",
        body: "Bizim için talep edilen projeler yalnızca bir ürün talebi değildir. Her uygulamayı kendi teknik gereklilikleri içinde değerlendiriyor, doğru analiz ile doğru çözümü buluşturarak müşterilerimizin üretim süreçlerine değer katmayı hedefliyoruz. CNR SEAL, teknik fitil ve ekstrüzyon profilleri alanında uzmanlaşmış, üretim süreçlerini doğru analiz ederek müşterilerine güvenilir ve sürdürülebilir çözümler sunan bir markadır.",
      },
    ],
  } : {
    heroTitle: "Reliable Technical Solutions in Seals and Extrusion Profiles",
    heroLead:
      "CNR SEAL is a specialised solution brand in technical seals and extrusion profiles that analyses each customer's production processes to bring together the right material, the right manufacturing method and the right solution — adding tangible value to their production.",
    sections: [
      {
        title: "Our Journey Into the Industry",
        body: "Our industry journey began in 2010 with the import of technical plastic and sealing products. Closely following the evolving needs of Turkish industry, we have grown into CNR SEAL — a brand specialised today in technical seals and extrusion profiles.",
      },
      {
        title: "Domestic Production and Sustainable Solutions",
        body: "Drawing on the commercial and technical experience we have built, we help manufacturers reach sustainable solutions that are not solely dependent on imports — leveraging domestic production capacity, correct raw material selection and reliable manufacturing technologies.",
      },
      {
        title: "Custom Profile Development and Mold Design",
        body: "Alongside standard product supply, we manage custom profile development from a technical drawing or sample, mold design, and contract manufacturing processes — bringing together the right material, the right production method and the right solution sources for every project.",
      },
      {
        title: "How We Approach Projects",
        body: "For us, each project is more than just a product request. We evaluate every application within its own technical requirements and pair the right analysis with the right solution — aiming to add value to our customers' production processes. CNR SEAL is a brand specialised in technical seals and extrusion profiles, delivering reliable and sustainable solutions grounded in accurate technical analysis.",
      },
    ],
  };

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-sm font-semibold uppercase tracking-wider text-accent-400">
            {dict.about.eyebrow}
          </div>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold">{content.heroTitle}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl leading-relaxed">{content.heroLead}</p>
        </div>
      </div>

      <StatsCounter locale={locale} />

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          {content.sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">{section.title}</h2>
              <p className="mt-4 text-lg text-brand-700 leading-relaxed">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
