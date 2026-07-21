import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, ArrowLeft } from "lucide-react";

import { getAllPosts, getPost } from "@/content/blog";
import { renderMarkdown } from "@/lib/markdown";
import { CustomRequestSection } from "@/components/sections/CustomRequestSection";
import { getDictionary, hasLocale } from "../../dictionaries";
import { locales } from "@/lib/site";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata(props: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) return {};
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title[locale],
    description: post.excerpt[locale],
  };
}

export default async function BlogPostPage(props: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await props.params;
  if (!hasLocale(locale)) notFound();
  const post = getPost(slug);
  if (!post) notFound();
  const dict = await getDictionary(locale);
  const html = renderMarkdown(post.content[locale]);

  return (
    <>
      <div className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-sm text-brand-600 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-accent-600">{dict.nav.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/blog`} className="hover:text-accent-600">{dict.nav.blog}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-brand-900 truncate">{post.title[locale]}</span>
          </nav>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-brand-950 leading-tight">
            {post.title[locale]}
          </h1>
          <div className="mt-5 flex items-center gap-5 text-sm text-brand-600">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { dateStyle: "long" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime} {locale === "tr" ? "dk okuma" : "min read"}
            </span>
            <span>{post.author}</span>
          </div>
        </div>
      </div>

      <article className="bg-white">
        <div
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
          <Link
            href={`/${locale}/blog`}
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
