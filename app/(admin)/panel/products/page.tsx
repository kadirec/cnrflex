import Link from "next/link";
import Image from "next/image";
import { asc, eq } from "drizzle-orm";
import { Plus, Pencil } from "lucide-react";
import { getDb, categories, products } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/panel/page-header";
import { DeleteProductButton } from "./delete-button";
import { ProductFilters } from "./filters";
import { getAllCategoriesFlat } from "@/lib/products";

type Search = { category?: string; q?: string };

async function loadCategories() {
  const flat = await getAllCategoriesFlat();
  return flat.map((c) => ({ id: c.id, nameTr: c.name.tr, slug: c.slug, depth: c.depth }));
}

async function loadProducts(categoryId?: number) {
  const db = getDb();
  const query = db
    .select({
      id: products.id,
      code: products.code,
      slug: products.slug,
      nameTr: products.nameTr,
      imageUrl: products.imageUrl,
      sortOrder: products.sortOrder,
      categoryId: products.categoryId,
      categoryNameTr: categories.nameTr,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(products.sortOrder), asc(products.nameTr));

  const rows = categoryId
    ? await query.where(eq(products.categoryId, categoryId))
    : await query;
  return rows;
}

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const catId = sp.category ? Number(sp.category) : undefined;
  const q = sp.q?.toLowerCase().trim() || "";

  const [cats, rowsRaw] = await Promise.all([loadCategories(), loadProducts(catId)]);
  const rows = q
    ? rowsRaw.filter(
        (r) => r.nameTr.toLowerCase().includes(q) || r.code.toLowerCase().includes(q),
      )
    : rowsRaw;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Ürünler"
        description={`Toplam ${rows.length} ürün${catId ? " (filtrelenmiş)" : ""}`}
        actions={
          <Link href="/panel/products/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni ürün
            </Button>
          </Link>
        }
      />

      <div className="mb-4">
        <ProductFilters categories={cats} defaultCategory={catId?.toString()} defaultQuery={q} />
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-slate-500 mb-4">Sonuç bulunamadı.</p>
            <Link href="/panel/products/new">
              <Button>Yeni ürün ekle</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[64px_1fr_180px_100px_120px_140px] gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Ürün</div>
            <div>Kategori</div>
            <div>Kod</div>
            <div>Sıra</div>
            <div className="text-right">İşlem</div>
          </div>
          {rows.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[64px_1fr_180px_100px_120px_140px] gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
            >
              <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-900 truncate">{p.nameTr}</div>
                <div className="text-xs text-slate-500 truncate">/{p.slug}</div>
              </div>
              <div className="text-sm text-slate-700 truncate">{p.categoryNameTr}</div>
              <div className="text-sm text-slate-500">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {p.code}
                </Badge>
              </div>
              <div className="text-sm text-slate-600">{p.sortOrder}</div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/panel/products/${p.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Pencil className="w-3.5 h-3.5" />
                    Düzenle
                  </Button>
                </Link>
                <DeleteProductButton id={p.id} name={p.nameTr} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
