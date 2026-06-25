import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { ContactForm } from "@/components/forms/ContactForm";
import { getDictionary, hasLocale } from "../dictionaries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[locale]/iletisim">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.contact };
}

export default async function ContactPage(props: PageProps<"/[locale]/iletisim">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const infoItems = [
    { icon: Mail, label: dict.contact.email, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Phone, label: dict.contact.phone, value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: dict.contact.address, value: siteConfig.contact.address[locale] },
    { icon: Clock, label: dict.contact.hours, value: dict.contact.hoursValue },
  ];

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold">{dict.contact.title}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">{dict.contact.subtitle}</p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-brand-950">{locale === "tr" ? "Bize Ulaşın" : "Reach Out"}</h2>
              <ul className="mt-8 space-y-6">
                {infoItems.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 shrink-0 rounded-lg bg-brand-100 text-brand-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm text-brand-600">{label}</div>
                      {href ? (
                        <a href={href} className="mt-1 text-lg font-semibold text-brand-950 hover:text-accent-600 break-all">
                          {value}
                        </a>
                      ) : (
                        <div className="mt-1 text-lg font-semibold text-brand-950">{value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-brand-50 p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-brand-950">{locale === "tr" ? "Mesaj Gönder" : "Send a Message"}</h2>
              <ContactForm locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
