import Link from "next/link";
import { FolderTree, Package, ArrowRight } from "lucide-react";
import { count, ne } from "drizzle-orm";
import { getDb, categories, products, ROOT_CATEGORY_SLUG } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function loadStats() {
  const db = getDb();
  const [c, p] = await Promise.all([
    db.select({ n: count() }).from(categories).where(ne(categories.slug, ROOT_CATEGORY_SLUG)),
    db.select({ n: count() }).from(products),
  ]);
  return { categories: c[0]?.n ?? 0, products: p[0]?.n ?? 0 };
}

export default async function PanelDashboard() {
  const stats = await loadStats();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Genel Bakış</h1>
        <p className="text-sm text-slate-500 mt-1">CNR Seal içerik yönetim paneli.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700">
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
