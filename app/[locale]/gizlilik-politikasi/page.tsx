import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, hasLocale } from "../dictionaries";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[locale]/gizlilik-politikasi">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.footer.privacy };
}

export default async function PrivacyPage(props: PageProps<"/[locale]/gizlilik-politikasi">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold">{dict.footer.privacy}</h1>
        </div>
      </div>

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content">
          {locale === "tr" ? (
            <>
              <p>
                Bu Gizlilik Politikası, {siteConfig.name} (&quot;biz&quot;, &quot;bizim&quot;) tarafından cnrflexis.com web sitesi
                aracılığıyla toplanan kişisel verilerin nasıl işlendiğini açıklar.
              </p>
              <h2>Toplanan Bilgiler</h2>
              <p>İletişim, teklif ve katalog formları aracılığıyla; adınız, e-postanız, telefonunuz, firma bilgileriniz ve mesajınızı toplarız.</p>
              <h2>Kullanım Amaçları</h2>
              <ul>
                <li>Talep ve teklif sürecini yönetmek</li>
                <li>Müşteri iletişimi ve teknik destek sağlamak</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
              <h2>Veri Saklama</h2>
              <p>Toplanan veriler yalnızca yukarıdaki amaçlar için ve gerekli süre boyunca saklanır.</p>
              <h2>Haklarınız</h2>
              <p>KVKK kapsamında verilerinize erişme, düzeltme ve silme haklarına sahipsiniz. Talepleriniz için <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> adresine yazabilirsiniz.</p>
              <p className="text-sm">Bu metin örnek niteliğindedir; nihai metin için hukuk danışmanı görüşü alınmalıdır.</p>
            </>
          ) : (
            <>
              <p>
                This Privacy Policy explains how {siteConfig.name} processes personal data collected through the
                cnrflexis.com website.
              </p>
              <h2>Information We Collect</h2>
              <p>Via contact, quote and catalog forms; we collect your name, email, phone, company information and message.</p>
              <h2>Purposes of Use</h2>
              <ul>
                <li>Manage requests and quote processes</li>
                <li>Provide customer communication and technical support</li>
                <li>Fulfill legal obligations</li>
              </ul>
              <h2>Data Retention</h2>
              <p>Collected data is retained only for the purposes above and for the necessary duration.</p>
              <h2>Your Rights</h2>
              <p>Under applicable data protection law, you have the right to access, correct and delete your data. For requests, contact <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
              <p className="text-sm">This text is a sample; obtain legal counsel for the final version.</p>
            </>
          )}
        </div>
      </article>
    </>
  );
}
