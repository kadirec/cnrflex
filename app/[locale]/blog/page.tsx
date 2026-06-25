import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowRight } from "lucide-react";

import { getAllPosts } from "@/content/blog";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata(props: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.blog };
}

export default async function BlogIndexPage(props: PageProps<"/[locale]/blog">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const posts = getAllPosts();

  return (
    <>
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold">{dict.nav.blog}</h1>
          <p className="mt-5 text-lg lg:text-xl text-brand-200 max-w-3xl">
            {locale === "tr"
              ? "Plastik profil ve fitil tedariği ve teknolojisi üzerine teknik içerikler, sektör haberleri ve mühendislik ipuçları."
              : "Technical content, industry news and engineering tips on plastic profile and seal supply and technology."}
          </p>
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-xl border border-brand-100 overflow-hidden hover:border-accent-500 hover:shadow-lg transition flex flex-col"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-brand-900 to-brand-700 relative">
                  <div className="absolute inset-0 grid place-items-center p-6">
                    <span className="font-display text-2xl font-bold text-white/90 text-center leading-tight">
                      {post.title[locale]}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-brand-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", { dateStyle: "medium" })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime} {locale === "tr" ? "dk okuma" : "min read"}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-brand-950">{post.title[locale]}</h2>
                  <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1">{post.excerpt[locale]}</p>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600 group-hover:gap-2 transition-all"
                  >
                    {dict.common.readMore}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
