import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Target, Compass } from "lucide-react";

import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata(props: PageProps<"/[locale]/kurumsal/vizyon-misyon">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.vision };
}

export default async function VisionMissionPage(props: PageProps<"/[locale]/kurumsal/vizyon-misyon">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const content = locale === "tr" ? {
    title: "Vizyonumuz ve Misyonumuz",
    intro: "CNRFlexis olarak değerlerimiz, sektördeki yerimizi ve müşterilerimize sunduğumuz hizmeti şekillendirir.",
    vision: {
      title: "Vizyonumuz",
      body: "Plastik profil ve fitil tedariğinde Türkiye'nin tercih edilen markası olmak; mühendislik yetkinliğimizi sürekli geliştirerek küresel pazarlarda rekabetçi ve sürdürülebilir çözümler sunmak.",
    },
    mission: {
      title: "Misyonumuz",
      body: "Müşterilerimizin teknik beklentilerini en yüksek seviyede karşılayan, kalite standartlarından ödün vermeyen, uzun ömürlü ve çevreye duyarlı çözümler sunmak; tedarik zincirinin her aşamasında şeffaflık ve güveni esas almak.",
    },
    values: {
      title: "Değerlerimiz",
      items: [
        { title: "Kalite", body: "Her aşamada uluslararası standartlara uygun ürün portföyü." },
        { title: "Güvenilirlik", body: "Verdiğimiz sözü zamanında ve eksiksiz yerine getirmek." },
        { title: "İnovasyon", body: "Sürekli iyileştirme ve teknolojik yenilik." },
        { title: "Sürdürülebilirlik", body: "Çevreye saygılı tedarik ve geri dönüştürülebilir malzeme." },
      ],
    },
  } : {
    title: "Our Vision & Mission",
    intro: "Our values shape our position in the industry and the service we deliver to our customers.",
    vision: {
      title: "Our Vision",
      body: "To become Turkey's preferred supply partner for plastic profiles and seals; continuously advancing engineering capability to deliver competitive and sustainable solutions in global markets.",
    },
    mission: {
      title: "Our Mission",
      body: "To deliver long-lasting, environmentally responsible solutions that meet our customers' technical expectations at the highest level without compromising on quality; placing transparency and trust at the core of every step of the supply chain.",
    },
    values: {
      title: "Our Values",
      items: [
        { title: "Quality", body: "A portfolio aligned with international standards at every step." },
        { title: "Reliability", body: "Delivering on every promise — on time and in full." },
        { title: "Innovation", body: "Continuous improvement and technological renewal." },
        { title: "Sustainability", body: "Environmentally respectful sourcing and recyclable materials." },
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
          <div className="grid lg:grid-cols-2 gap-8">
            <article className="rounded-2xl bg-brand-50 p-8 lg:p-10">
              <Compass className="h-10 w-10 text-accent-500" />
              <h2 className="mt-5 text-2xl font-bold text-brand-950">{content.vision.title}</h2>
              <p className="mt-4 text-brand-700 leading-relaxed text-lg">{content.vision.body}</p>
            </article>
            <article className="rounded-2xl bg-brand-900 text-white p-8 lg:p-10">
              <Target className="h-10 w-10 text-accent-400" />
              <h2 className="mt-5 text-2xl font-bold">{content.mission.title}</h2>
              <p className="mt-4 text-brand-200 leading-relaxed text-lg">{content.mission.body}</p>
            </article>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-brand-950">{content.values.title}</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.values.items.map((value, idx) => (
                <div key={value.title} className="rounded-xl border border-brand-100 p-6">
                  <div className="font-display text-3xl font-bold text-accent-500">{String(idx + 1).padStart(2, "0")}</div>
                  <h3 className="mt-3 text-lg font-semibold text-brand-950">{value.title}</h3>
                  <p className="mt-2 text-sm text-brand-700 leading-relaxed">{value.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
