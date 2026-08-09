import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  ArrowRight,
  Layers,
  Wrench,
  Cog,
  ShoppingCart,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getPublishedPosts, BLOG_CATEGORIES, getCategoryLabel } from "@/lib/blog";
import { getDictionary, hasLocale } from "../dictionaries";
import type { BlogCategory } from "@/lib/db";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildAlternates, canonicalUrl } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.nav.blog,
    alternates: buildAlternates(locale, "/blog"),
    openGraph: { url: canonicalUrl(locale, "/blog") },
  };
}

const CATEGORY_ICON: Record<BlogCategory, LucideIcon> = {
  "malzeme-rehberleri": Layers,
  "uygulama-rehberleri": Wrench,
  "uretim-teknolojileri": Cog,
  "satin-alma-rehberleri": ShoppingCart,
};

const CATEGORY_GRADIENT: Record<BlogCategory, string> = {
  "malzeme-rehberleri": "from-brand-800 to-brand-950",
  "uygulama-rehberleri": "from-accent-500 to-accent-700",
  "uretim-teknolojileri": "from-brand-600 to-brand-900",
  "satin-alma-rehberleri": "from-accent-600 to-brand-900",
};

export default async function BlogIndexPage(props: PageProps<"/[locale]/blog">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const { kategori } = await props.searchParams;
  const activeCategory =
    typeof kategori === "string" && BLOG_CATEGORIES.some((c) => c.slug === kategori)
      ? (kategori as BlogCategory)
      : null;

  const dict = await getDictionary(locale);
  const allPosts = await getPublishedPosts();

  const counts = new Map<BlogCategory, number>();
  for (const cat of BLOG_CATEGORIES) counts.set(cat.slug, 0);
  for (const post of allPosts) {
    const key = post.category as BlogCategory;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const posts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  const listLabel = locale === "tr" ? "Tüm Yazılar" : "All Posts";
  const clearLabel = locale === "tr" ? "Tümü" : "All";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.nav.home, url: `/${locale}` },
          { name: dict.nav.blog, url: `/${locale}/blog` },
        ]}
      />
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

      <section className="bg-brand-50 border-b border-brand-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <CategoryTile
              locale={locale}
              href={`/${locale}/blog`}
              label={clearLabel}
              icon={BookOpen}
              gradient="from-brand-500 to-brand-700"
              count={allPosts.length}
              active={activeCategory === null}
            />
            {BLOG_CATEGORIES.map((cat) => (
              <CategoryTile
                key={cat.slug}
                locale={locale}
                href={`/${locale}/blog?kategori=${cat.slug}`}
                label={getCategoryLabel(cat.slug, locale)}
                icon={CATEGORY_ICON[cat.slug]}
                gradient={CATEGORY_GRADIENT[cat.slug]}
                count={counts.get(cat.slug) ?? 0}
                active={activeCategory === cat.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-950">
              {activeCategory ? getCategoryLabel(activeCategory, locale) : listLabel}
            </h2>
            <span className="text-sm text-brand-600">
              {posts.length} {locale === "tr" ? "yazı" : "posts"}
            </span>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-brand-600 py-16">
              {locale === "tr" ? "Bu kategoride yazı bulunamadı." : "No posts found in this category."}
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-xl border border-brand-100 overflow-hidden hover:border-accent-500 hover:shadow-lg transition flex flex-col"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="block">
                    <div className="aspect-[16/10] bg-gradient-to-br from-brand-900 to-brand-700 relative">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={locale === "tr" ? post.titleTr : post.titleEn}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center p-6">
                          <span className="font-display text-2xl font-bold text-white/90 text-center leading-tight">
                            {locale === "tr" ? post.titleTr : post.titleEn}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs">
                      <Link
                        href={`/${locale}/blog?kategori=${post.category}`}
                        className="inline-flex items-center rounded-full bg-brand-50 border border-brand-100 px-2.5 py-1 font-semibold text-brand-700 hover:border-accent-500 hover:text-accent-600 transition"
                      >
                        {getCategoryLabel(post.category, locale)}
                      </Link>
                      {post.publishedAt && (
                        <span className="inline-flex items-center gap-1 text-brand-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.publishedAt).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
                            dateStyle: "medium",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-brand-950 line-clamp-2">
                      {locale === "tr" ? post.titleTr : post.titleEn}
                    </h3>
                    {(locale === "tr" ? post.excerptTr : post.excerptEn) && (
                      <p className="mt-2 text-sm text-brand-700 leading-relaxed flex-1 line-clamp-3">
                        {locale === "tr" ? post.excerptTr : post.excerptEn}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-brand-600">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingTime} {locale === "tr" ? "dk okuma" : "min read"}
                      </span>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 group-hover:gap-2 transition-all"
                      >
                        {dict.common.readMore}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryTile({
  locale,
  href,
  label,
  icon: Icon,
  gradient,
  count,
  active,
}: {
  locale: string;
  href: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-xl overflow-hidden ring-1 transition shadow-sm hover:shadow-md",
        active ? "ring-2 ring-accent-500" : "ring-brand-200 hover:ring-brand-300",
      )}
      aria-current={active ? "page" : undefined}
    >
      <div className={cn("relative aspect-[5/3] bg-gradient-to-br", gradient)}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="grid place-items-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-white/20 backdrop-blur text-white ring-1 ring-white/30">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="inline-flex items-center rounded-full bg-white/95 text-brand-900 text-[10px] sm:text-xs font-bold px-2 py-0.5">
              {count} {locale === "tr" ? "yazı" : "posts"}
            </span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base leading-snug">
            {label}
          </div>
        </div>
      </div>
    </Link>
  );
}
