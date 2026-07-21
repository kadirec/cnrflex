import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type Props = {
  dict: Dictionary;
};

export function StatsCounter({ dict }: Props) {
  const items = [
    { value: "1200", label: dict.stats.capacity },
    { value: "1200", label: dict.stats.area },
    { value: "100%", label: dict.stats.domestic },
    { value: "15+", label: dict.stats.experience },
  ];

  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center lg:text-left">
              <div className="font-display text-4xl lg:text-5xl font-bold text-brand-900">
                {item.value}
              </div>
              <div className="mt-2 text-sm text-brand-700 leading-snug">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
