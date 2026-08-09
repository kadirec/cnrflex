import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Target, Compass } from "lucide-react";

import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";
import { buildAlternates, canonicalUrl } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/[locale]/kurumsal/vizyon-misyon">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.nav.vision,
    alternates: buildAlternates(locale, "/kurumsal/vizyon-misyon"),
    openGraph: { url: canonicalUrl(locale, "/kurumsal/vizyon-misyon") },
  };
}

export default async function VisionMissionPage(props: PageProps<"/[locale]/kurumsal/vizyon-misyon">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const content = locale === "tr" ? {
    title: "Vizyonumuz ve Misyonumuz",
    intro: "CNR SEAL olarak değerlerimiz, sektördeki yerimizi ve müşterilerimize sunduğumuz hizmeti şekillendirir.",
    vision: {
      title: "Vizyonumuz",
      lead:
        "Bilgiye dayalı çalışma anlayışımızı sürekli geliştirerek, teknik fitil ve ekstrüzyon profilleri alanında güvenilirliği, uzmanlığı ve çözüm yaklaşımıyla ulusal ve uluslararası pazarlarda referans gösterilen bir Türk markası olmak.",
      body: [
        "Teknik fitil ve ekstrüzyon profilleri alanında yalnızca ürünleriyle değil; çalışma anlayışı, teknik yaklaşımı ve güvenilir iş modeliyle örnek gösterilen bir Türk markası olmak.",
        "Ülkemizin üretim gücünü, yerli hammadde kaynaklarını ve teknik bilgi birikimini destekleyerek, mümkün olan her alanda sürdürülebilir ve rekabetçi üretim modellerinin gelişmesine katkı sağlamayı hedefliyoruz.",
        "Bununla birlikte, günümüz sanayisinin küresel bir ekosistem olduğunun bilinciyle hareket ediyor; doğru çözümün gerektirdiği durumlarda uluslararası bilgi, teknoloji ve hammadde kaynaklarını da aynı profesyonel bakış açısıyla değerlendiriyoruz.",
        "Vizyonumuz; teknik sızdırmazlık sektöründe yalnızca ürün tedarik eden bir firma olmak değil, doğru teknik kararların alınmasına katkı sağlayan, üretim süreçlerini geliştiren ve sektörün güven duyduğu çözüm markalarından biri hâline gelmektir.",
        "Bugün kurduğumuz her iş ortaklığını geleceğe yapılan bir yatırım olarak görüyor; bilgi paylaşımı, sürekli gelişim ve karşılıklı güven ilkeleriyle Türkiye'den doğan, uluslararası pazarlarda saygı duyulan bir marka olmayı amaçlıyoruz.",
      ],
    },
    mission: {
      title: "Misyonumuz",
      lead:
        "Her projeye önce anlamaya çalışarak yaklaşmak; doğru analiz, doğru malzeme, doğru üretim yöntemi ve güvenilir iş birlikleriyle müşterilerimizin üretim süreçlerine sürdürülebilir değer katmak.",
      body: [
        "Üretim sektöründe güvenilir bir çözümün yalnızca kaliteli bir ürünle değil; doğru analiz, doğru malzeme seçimi ve doğru üretim süreciyle mümkün olduğuna inanıyoruz.",
        "Bu anlayışla, müşterilerimizin ihtiyaçlarını öncelikle teknik açıdan değerlendiriyor; talep edilen ürünü değil, ihtiyacın gerçek nedenini anlamaya odaklanıyoruz. Çünkü yaşanan bir teknik problem bazen hammaddeden, bazen kalıp tasarımından, bazen üretim teknolojisinden, bazen ise uygulama veya lojistik süreçlerinden kaynaklanabilir.",
        "CNR SEAL olarak görevimiz; tüm bu süreçleri bir bütün olarak değerlendirerek, doğru teknik çözümleri güvenilir üretim modelleriyle buluşturmak ve müşterilerimizin üretim süreçlerine sürdürülebilir değer katmaktır.",
        "Standart ürün tedariğinin ötesinde, özel profil geliştirme, teknik danışmanlık, kalıp geliştirme ve üretim koordinasyonu gibi süreçleri disiplinler arası bir bakış açısıyla yönetiyor; her projeye uzun vadeli bir iş ortaklığı anlayışıyla yaklaşıyoruz.",
        "Çalışma anlayışımızın temelinde dürüstlük, güven ve sorumluluk yer alır. Veremeyeceğimiz sözü vermemeyi, doğru çözüm olduğuna inanmadığımız hiçbir ürünü önermemeyi ve müşterilerimizin üretim süreçlerini kendi sorumluluğumuz gibi sahiplenmeyi en önemli çalışma prensiplerimiz olarak görüyoruz.",
      ],
    },
    values: {
      title: "Değerlerimiz",
      items: [
        { title: "Kalite Anlayışımız", body: "Kaliteyi yalnızca ürün özellikleriyle değil; doğru malzeme seçimi, planlı üretim ve sürdürülebilir performansın bütünü olarak değerlendiriyoruz." },
        { title: "Güvenilirlik", body: "Verdiğimiz sözün arkasında durmayı, süreç boyunca şeffaf iletişim kurmayı ve uzun vadeli güven ilişkileri oluşturmayı önceliğimiz olarak görüyoruz." },
        { title: "Teknik Uzmanlık", body: "Her projeyi ihtiyaçları doğrultusunda analiz ediyor; teknik bilgi ve üretim deneyimimizi doğru çözümlere dönüştürüyoruz." },
        { title: "Sürdürülebilir İş Birliği", body: "Müşterilerimizle yalnızca ürün odaklı değil; üretim süreçlerine değer katan, uzun soluklu iş ortaklıkları kurmayı hedefliyoruz." },
      ],
    },
  } : {
    title: "Our Vision & Mission",
    intro: "Our values shape our position in the industry and the service we deliver to our customers.",
    vision: {
      title: "Our Vision",
      lead:
        "To be a Turkish brand continuously advancing its knowledge-driven way of working — recognised in national and international markets for its reliability, expertise and solution-driven approach in technical seals and extrusion profiles.",
      body: [
        "To be recognised as a benchmark Turkish brand in technical seals and extrusion profiles — not only for our products, but for our way of working, our technical approach and our reliable business model.",
        "By supporting the manufacturing capacity, domestic raw material sources and technical know-how of our country, we aim to contribute to the development of sustainable and competitive production models wherever possible.",
        "At the same time, we recognise that today's industry is a global ecosystem — and where the right solution requires it, we apply the same professional lens to international knowledge, technology and raw material sources.",
        "Our vision is to be more than a supplier in the technical sealing sector; it is to become one of the trusted solution brands that contribute to the right technical decisions and help improve production processes.",
        "We see every partnership we build today as an investment in tomorrow — aiming, through knowledge sharing, continuous improvement and mutual trust, to become a brand born in Türkiye and respected in international markets.",
      ],
    },
    mission: {
      title: "Our Mission",
      lead:
        "To approach every project with a mindset of understanding first; to add sustainable value to our customers' production processes through the right analysis, the right material, the right manufacturing method and reliable partnerships.",
      body: [
        "We believe that a reliable solution in manufacturing comes not only from a quality product, but from the combination of the right analysis, the right material choice and the right production process.",
        "With this mindset, we assess our customers' needs technically first and focus on understanding the real cause of the need — not just the requested product. Because a technical problem may stem from raw material, mold design, production technology, application, or logistics.",
        "Our role at CNR SEAL is to evaluate all these processes as a whole, to pair the right technical solutions with reliable production models, and to add sustainable value to our customers' production.",
        "Beyond standard product supply, we manage custom profile development, technical consultancy, mold development and production coordination with a cross-disciplinary perspective — approaching every project with the mindset of a long-term partnership.",
        "Honesty, trust and responsibility are at the core of the way we work. Not making promises we cannot keep, not recommending any product we don't believe is the right solution, and taking ownership of our customers' production processes as our own — these are our most important working principles.",
      ],
    },
    values: {
      title: "Our Values",
      items: [
        { title: "Our Approach to Quality", body: "We define quality not only by product features, but as the sum of the right material choice, planned production and sustainable performance." },
        { title: "Reliability", body: "We consider it a priority to stand behind our promises, maintain transparent communication throughout the process, and build long-term relationships of trust." },
        { title: "Technical Expertise", body: "We analyse every project by its own needs and translate our technical knowledge and manufacturing experience into the right solutions." },
        { title: "Sustainable Partnerships", body: "We aim to build long-lasting partnerships with our customers — not just product-focused, but adding real value across their production processes." },
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
              <blockquote className="mt-5 text-lg lg:text-xl font-semibold text-brand-950 leading-snug border-l-4 border-accent-500 pl-4 italic">
                &ldquo;{content.vision.lead}&rdquo;
              </blockquote>
              <div className="mt-5 space-y-3 text-brand-700 leading-relaxed">
                {content.vision.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
            <article className="rounded-2xl bg-brand-900 text-white p-8 lg:p-10">
              <Target className="h-10 w-10 text-accent-400" />
              <h2 className="mt-5 text-2xl font-bold">{content.mission.title}</h2>
              <blockquote className="mt-5 text-lg lg:text-xl font-semibold text-white leading-snug border-l-4 border-accent-400 pl-4 italic">
                &ldquo;{content.mission.lead}&rdquo;
              </blockquote>
              <div className="mt-5 space-y-3 text-brand-200 leading-relaxed">
                {content.mission.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
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
