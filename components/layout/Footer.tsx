import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

import { siteConfig, type Locale } from "@/lib/site";
import type { Dictionary } from "@/app/[locale]/dictionaries";

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function Footer({ locale, dict }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="grid place-items-center h-9 px-2.5 rounded-lg bg-accent-500 text-white font-display font-bold text-sm tracking-tight">
                CNR
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Flexis
              </span>
            </div>
            <p className="text-sm text-brand-300 leading-relaxed">{dict.footer.tagline}</p>
            <p className="mt-4 text-sm text-brand-400 leading-relaxed">{siteConfig.description[locale]}</p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/kurumsal/hakkimizda`} className="hover:text-accent-400">{dict.nav.about}</Link></li>
              <li><Link href={`/${locale}/urunler`} className="hover:text-accent-400">{dict.nav.products}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-accent-400">{dict.nav.blog}</Link></li>
              <li><Link href={`/${locale}/katalog`} className="hover:text-accent-400">{dict.nav.catalog}</Link></li>
              <li><Link href={`/${locale}/teklif-al`} className="hover:text-accent-400">{dict.nav.getQuote}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.footer.products}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/urunler/otomatik-kepenk-fitilleri`} className="hover:text-accent-400">{locale === "tr" ? "Otomatik Kepenk Fitilleri" : "Automatic Shutter Seals"}</Link></li>
              <li><Link href={`/${locale}/urunler/pergola-fitilleri`} className="hover:text-accent-400">{locale === "tr" ? "Pergola Fitilleri" : "Pergola Seals"}</Link></li>
              <li><Link href={`/${locale}/urunler/biyoklimatik-fitiller`} className="hover:text-accent-400">{locale === "tr" ? "Biyoklimatik Fitiller" : "Bioclimatic Seals"}</Link></li>
              <li><Link href={`/${locale}/urunler/kapi-fitilleri`} className="hover:text-accent-400">{locale === "tr" ? "Kapı Fitilleri" : "Door Seals"}</Link></li>
              <li><Link href={`/${locale}/urunler/tente-fitil-profilleri`} className="hover:text-accent-400">{locale === "tr" ? "Tente Fitil Profilleri" : "Awning Seal Profiles"}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dict.footer.contact}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent-400 mt-0.5 shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-accent-400 break-all">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent-400 mt-0.5 shrink-0" />
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-accent-400">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent-400 mt-0.5 shrink-0" />
                <span>{siteConfig.contact.address[locale]}</span>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="grid place-items-center h-9 w-9 rounded-full bg-brand-800 hover:bg-accent-500 transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="grid place-items-center h-9 w-9 rounded-full bg-brand-800 hover:bg-accent-500 transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="grid place-items-center h-9 w-9 rounded-full bg-brand-800 hover:bg-accent-500 transition">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.youtube} aria-label="YouTube" className="grid place-items-center h-9 w-9 rounded-full bg-brand-800 hover:bg-accent-500 transition">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-400">
          <p>&copy; {year} {siteConfig.name}. {dict.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/gizlilik-politikasi`} className="hover:text-accent-400">{dict.footer.privacy}</Link>
            <Link href={`/${locale}/kullanim-sartlari`} className="hover:text-accent-400">{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
