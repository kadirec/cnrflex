import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import {
  IconExtrusion,
  IconMoldDesign,
  IconProjectMgmt,
} from "@/components/icons/CapabilityIcons";

const CAPABILITIES = [
  { key: "extrusion", Icon: IconExtrusion },
  { key: "mold", Icon: IconMoldDesign },
  { key: "project", Icon: IconProjectMgmt },
] as const;

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function CustomRequestSectionClient({ locale, dict }: Props) {
  const customHref = `/${locale}/teklif-al?mode=custom`;

  return (
    <section
      id="ozel-talep"
      className="relative scroll-mt-24 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_auto] items-end gap-8 lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/15 border border-accent-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300">
              <Sparkles className="h-3.5 w-3.5" />
              {dict.custom.eyebrow}
            </div>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold">{dict.custom.title}</h2>
            <p className="mt-4 text-base lg:text-lg text-brand-200 leading-relaxed max-w-2xl">
              {dict.custom.lead}
            </p>
          </div>
          <Link
            href={customHref}
            className="group inline-flex items-center gap-2 self-start lg:self-auto rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
          >
            {dict.custom.cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {CAPABILITIES.map(({ key, Icon }) => {
            const cap = dict.custom.capabilities[key];
            return (
              <div
                key={key}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 transition hover:bg-white/[0.07] hover:border-accent-500/40"
              >
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25 group-hover:bg-accent-500/25 group-hover:text-accent-300 transition">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{cap.title}</h3>
                <p className="mt-2 text-sm text-brand-300 leading-relaxed">{cap.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
