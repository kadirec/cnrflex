import { redirect } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { ProductForm } from "@/components/panel/product-form";
import { createProduct } from "@/lib/actions-products";
import { getAllCategoriesFlat } from "@/lib/products";

export const metadata = { title: "Yeni Ürün — Panel" };

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const flat = await getAllCategoriesFlat();
  const cats = flat.map((c) => ({ id: c.id, nameTr: c.name.tr, depth: c.depth }));

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
