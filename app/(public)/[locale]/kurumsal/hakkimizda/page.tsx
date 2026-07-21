import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatsCounter } from "@/components/sections/StatsCounter";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata(props: PageProps<"/[locale]/kurumsal/hakkimizda">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.about };
}

export default async function AboutPage(props: PageProps<"/[locale]/kurumsal/hakkimizda">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const content = locale === "tr" ? {
    hero: "CNR Seal, plastik profil ve fitil tedariğinde güvenilir bir çözüm ortağı olarak modern ekstrüzyon teknolojisini ve mühendislik uzmanlığını birleştiren bir markadır.",
    sections: [
      {
        title: "Tedarik Yaklaşımımız",
        body: "Modern ekstrüzyon teknolojisiyle üretilmiş, sıkı kalite kontrolünden geçmiş ürünler portföyümüzde standartların üzerinde performansla sunulur. PVC, TPE ve TPU bazlı malzemelerin doğru seçimi, ürünün dayanıklılığını doğrudan etkileyen kritik bir aşamadır; bu nedenle malzeme seçiminden sevkiyata kadar tüm süreç titizlikle yönetilir.",
      },
      {
        title: "Müşteri Odaklı Çözüm",
        body: "Her müşterimizin ihtiyacı farklıdır. Standart ürün portföyümüze ek olarak özel kesit, renk ve boyut talepleri karşılanabilir. Mühendislik ekibimiz, projenize en uygun çözümü sunmak için baştan sona danışmanlık verir.",
      },
      {
        title: "Sürdürülebilirlik",
        body: "Tedarik süreçlerimizde enerji verimliliği ve atık azaltma ön plandadır. Geri dönüştürülebilir malzeme kullanımı, çevreye duyarlı paketleme ve yerli onaylı kaynaklı tedarik ile hem ekonomik hem ekolojik değer sunulur.",
      },
    ],
  } : {
    hero: "CNR Seal is a trusted supply partner for plastic profiles and seals, combining modern extrusion-based products with engineering expertise.",
    sections: [
      {
        title: "Our Supply Approach",
        body: "Products manufactured with modern extrusion technology and passed through strict quality control are offered in our portfolio with above-standard performance. The right selection of PVC, TPE and TPU based materials is the critical step that directly affects product durability; therefore the entire process — from material selection to shipping — is managed with care.",
      },
      {
        title: "Customer-Focused Solutions",
        body: "Every customer has unique needs. In addition to our standard portfolio, custom cross-section, color and dimension requests can be fulfilled. Our engineering team provides end-to-end consulting to deliver the most suitable solution for your project.",
      },
      {
        title: "Sustainability",
        body: "Energy efficiency and waste reduction are central to our supply processes. With recyclable material usage, environmentally conscious packaging and domestic approved sourcing, both economic and ecological value are delivered.",
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
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold">{dict.about.title}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl leading-relaxed">{content.hero}</p>
        </div>
      </div>

      <StatsCounter dict={dict} />

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
