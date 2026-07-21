"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/panel", label: "Genel Bakış", icon: LayoutDashboard, match: (p: string) => p === "/panel" },
  { href: "/panel/categories", label: "Kategoriler", icon: FolderTree, match: (p: string) => p.startsWith("/panel/categories") },
  { href: "/panel/products", label: "Ürünler", icon: Package, match: (p: string) => p.startsWith("/panel/products") },
];

export function PanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-brand-950 text-slate-100 flex-col">
      <div className="h-16 px-6 flex items-center gap-2 border-b border-white/10">
        <div className="w-8 h-8 rounded-md bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <div>
          <div className="font-bold text-white leading-tight">CNR Seal</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Panel</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
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
              <span>{label}</span>
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
