import { PageHeader } from "@/components/panel/page-header";
import { CategoryForm } from "@/components/panel/category-form";
import { createCategory } from "@/lib/actions-categories";

export const metadata = { title: "Yeni Kategori — Panel" };

export default function NewCategoryPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Yeni Kategori"
        description="Yeni bir ürün kategorisi oluşturun."
        backHref="/panel/categories"
      />
      <CategoryForm mode="create" action={createCategory} />
    </div>
  );
}
