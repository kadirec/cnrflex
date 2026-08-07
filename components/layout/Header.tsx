"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig, type Locale, locales } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";
import { CartMenu } from "@/components/cart/CartMenu";

type CategoryLink = {
  slug: string;
  label: string;
  image?: string | null;
  children: { slug: string; label: string; image?: string | null }[];
};

type Props = {
  locale: Locale;
  dict: Dictionary;
  categoryLinks: CategoryLink[];
};

type NavChild = {
  href: string;
  label: string;
  image?: string | null;
  children?: { href: string; label: string }[];
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
  footer?: { href: string; label: string };
  variant?: "simple" | "mega";
};

const flagMap: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
};

export function Header({ locale, dict, categoryLinks }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobile = () => {
    setOpen(false);
    setMobileSection(null);
    setMobileCategory(null);
  };

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const openMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setMegaOpen(true);
  };
  const scheduleMegaClose = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  const navItems: NavItem[] = [
    { href: `/${locale}`, label: dict.nav.home },
    {
      label: dict.nav.corporate,
      children: [
        { href: `/${locale}/kurumsal/hakkimizda`, label: dict.nav.about },
        { href: `/${locale}/kurumsal/vizyon-misyon`, label: dict.nav.vision },
      ],
    },
    {
      label: dict.nav.products,
      href: `/${locale}/urunler`,
      variant: "mega",
      children: categoryLinks.map((c) => ({
        href: `/${locale}/urunler/${c.slug}`,
        label: c.label,
        image: c.image ?? null,
        children: c.children.map((ch) => ({
          href: `/${locale}/urunler/${ch.slug}`,
          label: ch.label,
        })),
      })),
    },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/katalog`, label: dict.nav.catalog },
    { href: `/${locale}/iletisim`, label: dict.nav.contact },
  ];

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return `/${locale}`;
    const segments = pathname.split("/").filter(Boolean);
    if ((locales as readonly string[]).includes(segments[0] ?? "")) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    return "/" + segments.join("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-100">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 lg:h-24 items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center" aria-label={siteConfig.name}>
            <Image
              src="/logo.png"
              alt={siteConfig.name}
              width={1938}
              height={811}
              priority
              className="h-14 lg:h-[77px] w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.children) {
                const isMega = item.variant === "mega";
                const isOpen = isMega ? megaOpen : openMenu === item.label;
                const enter = isMega ? openMega : () => setOpenMenu(item.label);
                const leave = isMega ? scheduleMegaClose : () => setOpenMenu(null);
                const TriggerInner = (
                  <>
                    {item.label}
                    <ChevronDown className={cn("h-4 w-4 transition", isOpen && "rotate-180")} />
                  </>
                );
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={enter}
                    onMouseLeave={leave}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-brand-800 hover:text-accent-600 transition"
                      >
                        {TriggerInner}
                      </Link>
                    ) : (
                      <button
                        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-brand-800 hover:text-accent-600 transition"
                        type="button"
                      >
                        {TriggerInner}
                      </button>
                    )}
                    {isOpen && !isMega && (
                      <div className="absolute left-0 top-full pt-1 w-64">
                        <div className="bg-white rounded-lg shadow-lg border border-brand-100 py-2">
                          {item.children.map((child) => (
                            <div key={child.href}>
                              <Link
                                href={child.href}
                                className="block px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50 hover:text-accent-600"
                              >
                                {child.label}
                              </Link>
                              {child.children && child.children.length > 0 && (
                                <div className="border-l-2 border-brand-100 ml-6 mb-1">
                                  {child.children.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className="block pl-4 pr-4 py-1.5 text-xs text-brand-600 hover:bg-brand-50 hover:text-accent-600"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {item.footer && (
                            <div className="px-3 pt-2 mt-2 border-t border-brand-100">
                              <Link
                                href={item.footer.href}
                                className="flex items-center justify-center gap-1 rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition"
                              >
                                {item.footer.label}
                                <ChevronDown className="h-4 w-4 -rotate-90" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition",
                    pathname === item.href
                      ? "text-accent-600"
                      : "text-brand-800 hover:text-accent-600",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`/${locale}/teklif-al`}
              className="inline-flex items-center justify-center rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition"
            >
              {dict.nav.getQuote}
            </Link>
            <CartMenu locale={locale} variant="desktop" />
            <div className="flex items-center gap-1 rounded-full bg-brand-50 p-1 ring-1 ring-brand-100">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  aria-label={l === "tr" ? "Türkçe" : "English"}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition",
                    locale === l
                      ? "bg-white text-brand-900 shadow-sm"
                      : "text-brand-600 hover:text-brand-900",
                  )}
                >
                  <span className="text-base leading-none">{flagMap[l]}</span>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:hidden inline-flex items-center gap-0.5 rounded-full bg-brand-50 p-0.5 ring-1 ring-brand-100">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                aria-label={l === "tr" ? "Türkçe" : "English"}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition",
                  locale === l ? "bg-white text-brand-900 shadow-sm" : "text-brand-600",
                )}
              >
                <span className="text-sm leading-none">{flagMap[l]}</span>
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <CartMenu locale={locale} variant="mobile" />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => (open ? closeMobile() : setOpen(true))}
              className={cn(
                "inline-flex items-center justify-center rounded-md p-2 text-brand-900 hover:bg-brand-50 transition",
                open && "bg-brand-100 text-brand-950",
              )}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {megaOpen && (
          <div
            className="hidden lg:block absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 top-full pt-1 z-50"
            onMouseEnter={openMega}
            onMouseLeave={scheduleMegaClose}
          >
            <div className="bg-white rounded-xl shadow-xl border border-brand-100 p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryLinks.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${locale}/urunler/${c.slug}`}
                    className="group/tile flex items-center gap-4 rounded-lg border border-brand-100 p-2 hover:border-brand-200 hover:bg-brand-50/60 transition"
                  >
                    <span className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-md bg-brand-100 ring-1 ring-brand-100">
                      {c.image && (
                        <Image
                          src={c.image}
                          alt={c.label}
                          fill
                          sizes="84px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-brand-900 group-hover/tile:text-accent-600 transition">
                        {c.label}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-400 group-hover/tile:text-accent-600 transition">
                        {dict.nav.view}
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-30 lg:hidden bg-white flex flex-col">
          <div className="shrink-0 px-4 py-3 border-b border-brand-100 grid grid-cols-2 gap-2">
            <Link
              href={`/${locale}/teklif-al`}
              onClick={closeMobile}
              className="inline-flex items-center justify-center rounded-md bg-accent-500 hover:bg-accent-600 px-3 py-2.5 text-sm font-semibold text-white"
            >
              {dict.nav.getQuote}
            </Link>
            <Link
              href={`/${locale}/teklif-al?mode=custom`}
              onClick={closeMobile}
              className="inline-flex items-center justify-center rounded-md border border-accent-500 text-accent-600 hover:bg-accent-50 px-3 py-2.5 text-sm font-semibold"
            >
              {dict.custom.modalTitle}
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {navItems.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={closeMobile}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md text-[15px] font-semibold text-brand-900 hover:bg-brand-50"
                  >
                    {item.label}
                  </Link>
                );
              }
              const sectionOpen = mobileSection === item.label;
              const isMega = item.variant === "mega";
              return (
                <div key={item.label} className="rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileSection(sectionOpen ? null : item.label);
                      setMobileCategory(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-semibold text-brand-900 hover:bg-brand-50 transition",
                      sectionOpen && "bg-brand-50/60",
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-brand-500 transition",
                        sectionOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {sectionOpen && !isMega && (
                    <div className="px-2 py-1.5 space-y-0.5 bg-brand-50/40 rounded-b-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMobile}
                          className="block px-3 py-2 rounded-md text-sm font-medium text-brand-800 hover:bg-white hover:text-accent-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {sectionOpen && isMega && (
                    <div className="p-2 bg-brand-50/40 rounded-b-md space-y-1.5">
                      {item.href && (
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center justify-between px-3 py-2 rounded-md bg-white ring-1 ring-brand-100 text-sm font-semibold text-brand-900 hover:text-accent-600"
                        >
                          {dict.nav.products}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )}
                      <div className="space-y-1.5">
                        {categoryLinks.map((c) => {
                          const catOpen = mobileCategory === c.slug;
                          const hasSubs = c.children.length > 0;
                          return (
                            <div
                              key={c.slug}
                              className="rounded-md bg-white ring-1 ring-brand-100 overflow-hidden"
                            >
                              {hasSubs ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMobileCategory(catOpen ? null : c.slug)
                                  }
                                  className="w-full flex items-center gap-3 p-2 text-left"
                                >
                                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-100">
                                    {c.image && (
                                      <Image
                                        src={c.image}
                                        alt={c.label}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1 text-sm font-semibold text-brand-900 truncate">
                                    {c.label}
                                  </span>
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 shrink-0 text-brand-500 transition",
                                      catOpen && "rotate-180",
                                    )}
                                  />
                                </button>
                              ) : (
                                <Link
                                  href={`/${locale}/urunler/${c.slug}`}
                                  onClick={closeMobile}
                                  className="flex items-center gap-3 p-2"
                                >
                                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-100">
                                    {c.image && (
                                      <Image
                                        src={c.image}
                                        alt={c.label}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1 text-sm font-semibold text-brand-900 truncate">
                                    {c.label}
                                  </span>
                                  <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-400" />
                                </Link>
                              )}
                              {catOpen && hasSubs && (
                                <div className="border-t border-brand-100 p-1.5 space-y-0.5">
                                  <Link
                                    href={`/${locale}/urunler/${c.slug}`}
                                    onClick={closeMobile}
                                    className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold text-accent-600 hover:bg-brand-50"
                                  >
                                    {c.label}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                  </Link>
                                  {c.children.map((sub) => (
                                    <Link
                                      key={sub.slug}
                                      href={`/${locale}/urunler/${sub.slug}`}
                                      onClick={closeMobile}
                                      className="block px-3 py-1.5 rounded-md text-xs text-brand-700 hover:bg-brand-50 hover:text-accent-600 truncate"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
