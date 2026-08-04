import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb, categories, products } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/panel/page-header";
import { ProductsTable, type ProductRow } from "./products-table";
import { ProductFilters } from "./filters";
import { getAllCategoriesFlat } from "@/lib/products";

type Search = { category?: string; q?: string };

async function loadCategories() {
  const flat = await getAllCategoriesFlat();
  return flat.map((c) => ({ id: c.id, nameTr: c.name.tr, slug: c.slug, depth: c.depth }));
}

async function loadProducts(categoryId?: number): Promise<ProductRow[]> {
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
  return rows.map((r) => ({
    id: r.id,
    code: r.code,
    slug: r.slug,
    nameTr: r.nameTr,
    imageUrl: r.imageUrl,
    sortOrder: r.sortOrder,
    categoryNameTr: r.categoryNameTr,
  }));
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
        <ProductsTable rows={rows} />
      )}
    </div>
  );
}
