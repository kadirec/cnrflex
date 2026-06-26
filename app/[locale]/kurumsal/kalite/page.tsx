import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Factory, Settings, BadgeCheck, Recycle } from "lucide-react";

import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata(props: PageProps<"/[locale]/kurumsal/kalite">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.quality };
}

export default async function QualityPage(props: PageProps<"/[locale]/kurumsal/kalite">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const content = locale === "tr" ? {
    title: "Kalite & Tedarik",
    intro: "Modern ekstrüzyon teknolojisi, deneyimli ekibimiz ve sıkı kalite kontrol süreçleriyle her ürün standartların üstünde sunulur.",
    items: [
      { icon: Factory, title: "1200 m² Stok & Sevkiyat Alanı", body: "Modern ekstrüzyon teknolojisiyle üretilmiş ürünler ve geniş stok alanıyla aynı çatı altında entegre tedarik." },
      { icon: Settings, title: "Özel Çözüm Tedariği", body: "Müşteri özelinde farklı kesit, renk ve sertlik seçenekleriyle özel çözüm tedariği." },
      { icon: BadgeCheck, title: "Kalite Kontrol", body: "Her sevkiyat öncesi ölçüm, tartım ve fiziksel testlerle doğrulanmış kalite." },
      { icon: Recycle, title: "Sürdürülebilirlik", body: "Geri dönüşüm odaklı tedarik akışı ve israfı minimize eden süreçler." },
    ],
    process: {
      title: "Tedarik & Hizmet Süreci",
      steps: [
        { num: "01", title: "Talep Analizi", body: "Müşteri ihtiyacı, kullanım alanı ve mekanik gereksinimler değerlendirilir." },
        { num: "02", title: "Mühendislik & Çözüm Seçimi", body: "Uygun kesit ve malzeme seçimi mühendislik desteğiyle netleştirilir; gerekli ise özel çözüm planlanır." },
        { num: "03", title: "Ürün Hazırlığı", body: "Stoktaki ürünler ayrılır; özel siparişlerde ekstrüzyon yöntemiyle hazırlanır." },
        { num: "04", title: "Kalite Kontrol", body: "Boyut, esneklik, renk ve sertlik testleri ile uygunluk doğrulanır." },
        { num: "05", title: "Paketleme & Sevkiyat", body: "Standart veya özel ambalajlama ile aynı gün sevkiyat seçeneği." },
      ],
    },
  } : {
    title: "Quality & Supply",
    intro: "With modern extrusion technology, our experienced team and strict quality control processes, every item is offered above standard.",
    items: [
      { icon: Factory, title: "1200 m² Stock & Logistics Area", body: "Integrated supply under one roof with products manufactured using modern extrusion technology and a broad stock area." },
      { icon: Settings, title: "Custom Solution Sourcing", body: "Custom cross-section, color and hardness options tailored to each customer's needs." },
      { icon: BadgeCheck, title: "Quality Control", body: "Quality verified through measurement, weighing and physical testing prior to every shipment." },
      { icon: Recycle, title: "Sustainability", body: "A recycling-focused supply flow and processes that minimize waste." },
    ],
    process: {
      title: "Supply & Service Process",
      steps: [
        { num: "01", title: "Requirements Analysis", body: "Customer needs, application area and mechanical requirements are assessed." },
        { num: "02", title: "Engineering & Solution Selection", body: "Appropriate cross-section and material selection is clarified with engineering support; custom solutions are planned when needed." },
        { num: "03", title: "Product Preparation", body: "Stocked items are allocated; for special orders, items are prepared using extrusion-based processes." },
        { num: "04", title: "Quality Control", body: "Conformance is verified through dimension, flexibility, color and hardness tests." },
        { num: "05", title: "Packaging & Shipping", body: "Standard or custom packaging with same-day shipping option." },
      ],
    },
  };

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="text-4xl lg:text-5xl font-bold">{content.title}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">{content.intro}</p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.items.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl bg-brand-50 p-6">
                <span className="grid place-items-center h-12 w-12 rounded-lg bg-accent-500 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-brand-950">{title}</h3>
                <p className="mt-2 text-sm text-brand-700 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 border-t border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-950">{content.process.title}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {content.process.steps.map((step) => (
              <div key={step.num} className="rounded-xl bg-white p-6 border border-brand-100">
                <div className="font-display text-2xl font-bold text-accent-500">{step.num}</div>
                <h3 className="mt-3 text-base font-semibold text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm text-brand-700 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
