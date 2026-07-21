"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ArrowRight, X } from "lucide-react";

import type { Locale } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import { CustomRequestForm } from "@/components/forms/CustomRequestForm";
import {
  IconExtrusion,
  IconMoldDesign,
  IconQualityLab,
  IconProjectMgmt,
} from "@/components/icons/CapabilityIcons";

const CAPABILITIES = [
  { key: "extrusion", Icon: IconExtrusion },
  { key: "mold", Icon: IconMoldDesign },
  { key: "lab", Icon: IconQualityLab },
  { key: "project", Icon: IconProjectMgmt },
] as const;

type Props = {
  locale: Locale;
  dict: Dictionary;
  categoryOptions: Array<{ value: string; label: string }>;
};

export function CustomRequestSectionClient({ locale, dict, categoryOptions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="ozel-talep"
        className="relative scroll-mt-24 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
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
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2 self-start lg:self-auto rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition"
            >
              {dict.custom.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
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

      <CustomRequestModal
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
        dict={dict}
        categoryOptions={categoryOptions}
      />
    </>
  );
}

type ModalProps = Props & { open: boolean; onClose: () => void };

function CustomRequestModal({ open, onClose, locale, dict, categoryOptions }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl my-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-950 transition z-10"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-brand-950 pr-10">{dict.custom.modalTitle}</h3>
          <p className="mt-2 text-sm text-brand-700">{dict.custom.modalSubtitle}</p>
          <CustomRequestForm
            locale={locale}
            dict={dict}
            onSuccess={onClose}
            categoryOptions={categoryOptions}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
