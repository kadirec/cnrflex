import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../../globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { QuoteCartProvider } from "@/components/cart/QuoteCartContext";
import { getDictionary, hasLocale } from "./dictionaries";
import { locales, siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import { getAllCategories } from "@/lib/products";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};

  const settings = await getSiteSettings();
  const description =
    (locale === "tr" ? settings.defaultMetaDescriptionTr : settings.defaultMetaDescriptionEn) ||
    siteConfig.description[locale];
  const defaultTitle =
    (locale === "tr" ? settings.defaultMetaTitleTr : settings.defaultMetaTitleEn) ||
    `${siteConfig.name} — ${locale === "tr" ? "Plastikte Modern Çözümler" : "Modern Solutions in Plastic"}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        tr: "/tr",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: defaultTitle,
      description,
      url: `${siteConfig.url}/${locale}`,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: settings.defaultOgImageUrl ? [{ url: settings.defaultOgImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: settings.defaultOgImageUrl ? [settings.defaultOgImageUrl] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const settings = await getSiteSettings();
  const categories = await getAllCategories();
  const categoryLinks = categories.map((c) => ({
    slug: c.slug,
    label: c.name[locale],
    children: c.children.map((ch) => ({ slug: ch.slug, label: ch.name[locale] })),
  }));

  return (
    <html lang={locale} className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <head>
        {settings.gtmContainerId && (
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtmContainerId}');`,
            }}
          />
        )}
        {settings.gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.gaMeasurementId}');`,
              }}
            />
          </>
        )}
        {settings.metaPixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.metaPixelId}');fbq('track', 'PageView');`,
            }}
          />
        )}
        {settings.headSnippet && (
          <div dangerouslySetInnerHTML={{ __html: settings.headSnippet }} />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-brand-950">
        {settings.gtmContainerId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmContainerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <OrganizationJsonLd locale={locale} />
        <QuoteCartProvider>
          <Header locale={locale} dict={dict} categoryLinks={categoryLinks} />
          <main className="flex-1">{props.children}</main>
          <Footer locale={locale} dict={dict} />
          <WhatsAppButton phone={settings.contactWhatsapp} label={dict.common.whatsapp} />
        </QuoteCartProvider>
        {settings.bodySnippet && (
          <div dangerouslySetInnerHTML={{ __html: settings.bodySnippet }} />
        )}
      </body>
    </html>
  );
}
