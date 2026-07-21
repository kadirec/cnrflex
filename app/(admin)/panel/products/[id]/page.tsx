import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, categories, products } from "@/lib/db";
import { PageHeader } from "@/components/panel/page-header";
import { ProductForm } from "@/components/panel/product-form";
import { updateProduct, type ProductFormState } from "@/lib/actions-products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const db = getDb();
  const [row] = await db.select().from(products).where(eq(products.id, numericId)).limit(1);
  if (!row) notFound();

  const cats = await db
    .select({ id: categories.id, nameTr: categories.nameTr })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.nameTr));

  const boundAction = updateProduct.bind(null, numericId) as (
    prev: ProductFormState,
    fd: FormData,
  ) => Promise<ProductFormState>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title={row.nameTr}
        description={`Ürün kodu: ${row.code}`}
        backHref="/panel/products"
      />
      <ProductForm mode="edit" product={row} categories={cats} action={boundAction} />
    </div>
  );
}
