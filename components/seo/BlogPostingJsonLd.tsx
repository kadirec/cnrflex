import { JsonLd } from "./JsonLd";
import { siteConfig, type Locale } from "@/lib/site";
import type { BlogPost } from "@/lib/db";

type Props = { locale: Locale; post: BlogPost };

export function BlogPostingJsonLd({ locale, post }: Props) {
  const title = locale === "tr" ? post.titleTr : post.titleEn;
  const description = locale === "tr" ? post.excerptTr : post.excerptEn;
  const url = `${siteConfig.url}/${locale}/blog/${post.slug}`;
  const published = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    author: { "@type": "Organization", name: post.author, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
  };
  if (description) data.description = description;
  if (post.coverImageUrl) data.image = [post.coverImageUrl];
  if (published) data.datePublished = published;
  if (modified) data.dateModified = modified;

  return <JsonLd data={data} />;
}
