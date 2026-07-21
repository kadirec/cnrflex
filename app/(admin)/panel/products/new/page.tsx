import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb, categories } from "@/lib/db";
import { PageHeader } from "@/components/panel/page-header";
import { ProductForm } from "@/components/panel/product-form";
import { createProduct } from "@/lib/actions-products";

export const metadata = { title: "Yeni Ürün — Panel" };

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const db = getDb();
  const cats = await db
    .select({ id: categories.id, nameTr: categories.nameTr })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.nameTr));

  if (cats.length === 0) {
    redirect("/panel/categories/new");
  }

  const sp = await searchParams;
  const defaultCategoryId = sp.category ? Number(sp.category) : undefined;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Yeni Ürün"
        description="Ürünü bir kategoriye ekleyin."
        backHref="/panel/products"
      />
      <ProductForm
        mode="create"
        categories={cats}
        defaultCategoryId={defaultCategoryId}
        action={createProduct}
      />
    </div>
  );
}
