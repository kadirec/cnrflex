import Link from "next/link";
import { FolderTree, Package, ArrowRight, MessageSquareText } from "lucide-react";
import { count } from "drizzle-orm";
import { getDb, categories, products } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { countUnread } from "@/lib/quotes";

async function loadStats() {
  const db = getDb();
  const [c, p, unread] = await Promise.all([
    db.select({ n: count() }).from(categories),
    db.select({ n: count() }).from(products),
    countUnread().catch(() => 0),
  ]);
  return {
    categories: c[0]?.n ?? 0,
    products: p[0]?.n ?? 0,
    unreadQuotes: unread,
  };
}

export default async function PanelDashboard() {
  const stats = await loadStats();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Genel Bakış</h1>
        <p className="text-sm text-slate-500 mt-1">CNR Seal içerik yönetim paneli.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          href="/panel/quotes?unread=1"
          icon={MessageSquareText}
          label="Okunmamış teklif"
          value={stats.unreadQuotes}
          accent={stats.unreadQuotes > 0}
        />
        <StatCard
          href="/panel/categories"
          icon={FolderTree}
          label="Kategoriler"
          value={stats.categories}
        />
        <StatCard
          href="/panel/products"
          icon={Package}
          label="Ürünler"
          value={stats.products}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hızlı işlemler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction href="/panel/categories/new" label="Yeni kategori ekle" />
          <QuickAction href="/panel/products/new" label="Yeni ürün ekle" />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        accent
          ? "group bg-white border border-accent-300 ring-2 ring-accent-100 rounded-xl p-5 hover:border-accent-500 hover:shadow-sm transition"
          : "group bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition"
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className={accent ? "text-3xl font-bold text-accent-600 mt-2" : "text-3xl font-bold text-slate-900 mt-2"}>
            {value}
          </div>
        </div>
        <div
          className={
            accent
              ? "w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600"
              : "w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700"
          }
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 text-xs text-brand-700 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        Yönet <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg hover:border-brand-300 hover:bg-slate-50 transition text-sm font-medium text-slate-700"
    >
      {label}
      <ArrowRight className="w-4 h-4 text-slate-400" />
    </Link>
  );
}
