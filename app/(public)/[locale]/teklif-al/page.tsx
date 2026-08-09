import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../dictionaries";
import { getSiteSettings } from "@/lib/settings";
import { getPickerProducts } from "@/lib/products";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { buildAlternates, canonicalUrl } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/[locale]/teklif-al">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.quote.title,
    alternates: buildAlternates(locale, "/teklif-al"),
    openGraph: { url: canonicalUrl(locale, "/teklif-al") },
  };
}

export default async function QuotePage(props: PageProps<"/[locale]/teklif-al">) {
  const { locale } = await props.params;
  const { product, category, mode } = await props.searchParams;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const prefillProduct = typeof product === "string" ? product : undefined;
  const prefillCategory = typeof category === "string" ? category : undefined;
  const initialMode = mode === "custom" ? "custom" : "catalog";
  const products = await getPickerProducts();
  const settings = await getSiteSettings();

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold">{dict.quote.title}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">{dict.quote.subtitle}</p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <QuoteForm
            locale={locale}
            dict={dict}
            products={products}
            prefillProductSlug={prefillProduct}
            prefillCategorySlug={prefillCategory}
            initialMode={initialMode}
          />
        </div>
      </section>

      <section className="bg-brand-50 border-y border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-brand-950">
                {locale === "tr" ? "Doğrudan İletişim" : "Direct Contact"}
              </h2>
              <p className="mt-2 text-sm text-brand-600">
                {locale === "tr"
                  ? "Mesai saatleri içinde en geç 4 saat içinde dönüş yapıyoruz."
                  : "We respond within 4 hours during business hours."}
              </p>
            </div>
            <ContactCard
              icon={Mail}
              label="E-posta"
              value={settings.contactEmail}
              href={`mailto:${settings.contactEmail}`}
            />
            <ContactCard
              icon={Phone}
              label={locale === "tr" ? "Telefon" : "Phone"}
              value={settings.contactPhone}
              href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
            />
            <ContactCard
              icon={MessageCircle}
              label="WhatsApp"
              value={locale === "tr" ? "Anında yazışın" : "Chat now"}
              href={`https://wa.me/${settings.contactWhatsapp}`}
              external
            />
          </div>
        </div>
      </section>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group rounded-2xl bg-white border border-brand-100 p-5 flex items-start gap-4 hover:border-accent-500 hover:shadow-sm transition"
    >
      <div className="w-10 h-10 rounded-lg bg-accent-50 grid place-items-center text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand-500">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-brand-950 group-hover:text-accent-600 transition break-all">
          {value}
        </div>
      </div>
    </a>
  );
}
