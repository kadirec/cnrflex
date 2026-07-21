"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig, type Locale, locales } from "@/lib/site";
import type { Dictionary } from "@/app/(public)/[locale]/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary;
  categoryLinks: Array<{ slug: string; label: string }>;
};

type NavItem = {
  label: string;
  href?: string;
  children?: { href: string; label: string }[];
  footer?: { href: string; label: string };
};

const flagMap: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
};

export function Header({ locale, dict, categoryLinks }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { href: `/${locale}`, label: dict.nav.home },
    {
      label: dict.nav.corporate,
      children: [
        { href: `/${locale}/kurumsal/hakkimizda`, label: dict.nav.about },
        { href: `/${locale}/kurumsal/vizyon-misyon`, label: dict.nav.vision },
        { href: `/${locale}/kurumsal/kalite`, label: dict.nav.quality },
      ],
    },
    {
      label: dict.nav.products,
      href: `/${locale}/urunler`,
      children: categoryLinks.map((c) => ({
        href: `/${locale}/urunler/${c.slug}`,
        label: c.label,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="grid place-items-center h-9 px-2.5 rounded-lg bg-brand-900 text-white font-display font-bold text-sm tracking-tight">
              CNR
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-brand-900">
              Seal
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.children) {
                const isOpen = openMenu === item.label;
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
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
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
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-1 w-64">
                        <div className="bg-white rounded-lg shadow-lg border border-brand-100 py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-brand-800 hover:bg-brand-50 hover:text-accent-600"
                            >
                              {child.label}
                            </Link>
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
            <Link
              href={`/${locale}/teklif-al`}
              className="inline-flex items-center justify-center rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition"
            >
              {dict.nav.getQuote}
            </Link>
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-brand-900 hover:bg-brand-50"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brand-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-500 px-3 pt-2">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-brand-800 hover:bg-brand-50"
                    >
                      {child.label}
                    </Link>
                  ))}
                  {item.footer && (
                    <Link
                      href={item.footer.href}
                      onClick={() => setOpen(false)}
                      className="mx-3 mt-2 flex items-center justify-center rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      {item.footer.label}
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-brand-800 hover:bg-brand-50"
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="flex items-center gap-2 mx-3 mt-3 pt-3 border-t border-brand-100">
              <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 p-1 ring-1 ring-brand-100">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    onClick={() => setOpen(false)}
                    aria-label={l === "tr" ? "Türkçe" : "English"}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition",
                      locale === l
                        ? "bg-white text-brand-900 shadow-sm"
                        : "text-brand-600",
                    )}
                  >
                    <span className="text-base leading-none">{flagMap[l]}</span>
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/${locale}/teklif-al`}
              onClick={() => setOpen(false)}
              className="block text-center rounded-md bg-accent-500 hover:bg-accent-600 px-4 py-2 text-base font-semibold text-white"
            >
              {dict.nav.getQuote}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
