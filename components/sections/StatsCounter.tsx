import type { Locale } from "@/lib/site";

type Item = {
  value: { tr: string; en: string };
  label: { tr: string; en: string };
};

const items: Item[] = [
  {
    value: { tr: "2010'dan Beri", en: "Since 2010" },
    label: { tr: "Sektör Deneyimi", en: "Industry Experience" },
  },
  {
    value: { tr: "100+", en: "100+" },
    label: { tr: "Teknik Profil Çözümü", en: "Technical Profile Solutions" },
  },
  {
    value: { tr: "Özel Üretim", en: "Custom Production" },
    label: { tr: "Kalıp & Profil Geliştirme", en: "Mold & Profile Development" },
  },
  {
    value: { tr: "Türkiye & İhracat", en: "Türkiye & Export" },
    label: { tr: "Yurt İçi ve Uluslararası Çözüm Ağı", en: "Domestic & International Solution Network" },
  },
];

type Props = {
  locale: Locale;
};

export function StatsCounter({ locale }: Props) {
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label[locale]} className="text-center lg:text-left">
              <div className="font-display text-3xl lg:text-4xl font-bold text-brand-900 leading-tight">
                {item.value[locale]}
              </div>
              <div className="mt-2 text-sm text-brand-700 leading-snug">{item.label[locale]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
