import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, ArrowLeft } from "lucide-react";

import { getPublishedPostBySlug } from "@/lib/blog";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import { getDictionary, hasLocale } from "../../dictionaries";
import { buildAlternates, canonicalUrl } from "@/lib/seo";
import { localePath, localePrefix } from "@/lib/site";

export async function generateMetadata(props: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  const title = locale === "tr" ? post.titleTr : post.titleEn;
  const description = locale === "tr" ? post.excerptTr : post.excerptEn;
  const path = `/blog/${post.slug}`;
  return {
    title,
    description: description ?? undefined,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "article",
      url: canonicalUrl(locale, path),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();
  const dict = await getDictionary(locale);
  const title = locale === "tr" ? post.titleTr : post.titleEn;
  const content = locale === "tr" ? post.contentTr : post.contentEn;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.nav.home, url: localePath(locale) },
          { name: dict.nav.blog, url: `${localePrefix(locale)}/blog` },
          { name: title, url: `${localePrefix(locale)}/blog/${post.slug}` },
        ]}
      />
      <BlogPostingJsonLd locale={locale} post={post} />
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-sm text-brand-600 flex-wrap">
            <Link href={localePath(locale)} className="hover:text-accent-600">{dict.nav.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`${localePrefix(locale)}/blog`} className="hover:text-accent-600">{dict.nav.blog}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-900 truncate">{title}</span>
          </nav>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-brand-950 leading-tight">{title}</h1>
          <div className="mt-5 flex items-center gap-5 text-sm text-brand-600 flex-wrap">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
                  dateStyle: "long",
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime} {locale === "tr" ? "dk okuma" : "min read"}
            </span>
            <span>{post.author}</span>
          </div>
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-brand-100">
              <Image
                src={post.coverImageUrl}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <article className="bg-white">
        <div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
          <Link
            href={`${localePrefix(locale)}/blog`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 hover:text-accent-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "tr" ? "Tüm yazılara dön" : "Back to all posts"}
          </Link>
        </div>
      </article>

      <CustomRequestSection locale={locale} dict={dict} />
    </>
  );
}
