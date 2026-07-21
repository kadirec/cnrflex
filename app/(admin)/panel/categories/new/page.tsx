import { PageHeader } from "@/components/panel/page-header";
import { CategoryForm, type ParentOption } from "@/components/panel/category-form";
import { createCategory } from "@/lib/actions-categories";
import { getAllCategoriesFlat } from "@/lib/products";

export const metadata = { title: "Yeni Kategori — Panel" };

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) {
  const flat = await getAllCategoriesFlat();
  const parentOptions: ParentOption[] = flat.map((c) => ({
    id: c.id,
    nameTr: c.name.tr,
    depth: c.depth,
  }));

  const sp = await searchParams;
  const defaultParentId = sp.parent ? Number(sp.parent) : null;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Yeni Kategori"
        description="Yeni bir ürün kategorisi oluşturun. Kök 'Ürünler' altında bir üst kategori seçebilirsiniz."
        backHref="/panel/categories"
      />
      <CategoryForm
        mode="create"
        action={createCategory}
        parentOptions={parentOptions}
        defaultParentId={defaultParentId}
      />
    </div>
  );
}
