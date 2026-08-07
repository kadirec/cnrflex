"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package, MessageSquareText, Newspaper, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/panel", label: "Genel Bakış", icon: LayoutDashboard, match: (p: string) => p === "/panel" },
  { href: "/panel/quotes", label: "Teklifler", icon: MessageSquareText, match: (p: string) => p.startsWith("/panel/quotes"), badgeKey: "unreadQuotes" as const },
  { href: "/panel/categories", label: "Kategoriler", icon: FolderTree, match: (p: string) => p.startsWith("/panel/categories") },
  { href: "/panel/products", label: "Ürünler", icon: Package, match: (p: string) => p.startsWith("/panel/products") },
  { href: "/panel/blog", label: "Blog", icon: Newspaper, match: (p: string) => p.startsWith("/panel/blog") },
  { href: "/panel/settings", label: "Ayarlar", icon: Settings, match: (p: string) => p.startsWith("/panel/settings") },
];

export function PanelSidebar({ unreadQuotes = 0 }: { unreadQuotes?: number }) {
  const pathname = usePathname();
  const badges: Record<string, number> = { unreadQuotes };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-brand-950 text-slate-100 flex-col">
      <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10">
        <Image
          src="/logo.png"
          alt="CNR Seal"
          width={160}
          height={107}
          className="h-8 w-auto brightness-0 invert"
        />
        <div className="text-[10px] uppercase tracking-wider text-slate-400">Panel</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const { href, label, icon: Icon, match } = item;
          const active = match(pathname);
          const badge = "badgeKey" in item && item.badgeKey ? badges[item.badgeKey] : 0;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-500 text-white text-[10px] font-bold">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-[11px] text-slate-500">
        © {new Date().getFullYear()} CNR Seal
      </div>
    </aside>
  );
}
