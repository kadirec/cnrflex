import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { getDictionary, hasLocale } from "../dictionaries";
import { siteConfig } from "@/lib/site";
import { Mail, Phone, MessageCircle } from "lucide-react";

export async function generateMetadata(props: PageProps<"/[locale]/teklif-al">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.quote.title };
}

export default async function QuotePage(props: PageProps<"/[locale]/teklif-al">) {
  const { locale } = await props.params;
  const { product } = await props.searchParams;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const defaultProduct = typeof product === "string" ? product : undefined;

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold">{dict.quote.title}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">{dict.quote.subtitle}</p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl bg-brand-50 p-6">
                <h2 className="text-lg font-semibold text-brand-950">
                  {locale === "tr" ? "Doğrudan İletişim" : "Direct Contact"}
                </h2>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-accent-500 mt-0.5" />
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-800 hover:text-accent-600 break-all">
                      {siteConfig.contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-accent-500 mt-0.5" />
                    <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="text-brand-800 hover:text-accent-600">
                      {siteConfig.contact.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-accent-500 mt-0.5" />
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-800 hover:text-accent-600"
                    >
                      WhatsApp
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-brand-900 text-white p-6">
                <h2 className="text-lg font-semibold">
                  {locale === "tr" ? "Hızlı Yanıt Sözü" : "Fast Response Promise"}
                </h2>
                <p className="mt-3 text-sm text-brand-200 leading-relaxed">
                  {locale === "tr"
                    ? "Mesai saatleri içinde gönderilen teklif taleplerine en geç 4 saat içinde dönüş yapıyoruz."
                    : "We respond to quote requests received during business hours within 4 hours."}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-2">
              <QuoteForm locale={locale} dict={dict} defaultProduct={defaultProduct} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
