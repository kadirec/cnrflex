import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, categories } from "@/lib/db";
import { PageHeader } from "@/components/panel/page-header";
import { CategoryForm } from "@/components/panel/category-form";
import { updateCategory, type CategoryFormState } from "@/lib/actions-categories";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const db = getDb();
  const [row] = await db.select().from(categories).where(eq(categories.id, numericId)).limit(1);
  if (!row) notFound();

  const boundAction = updateCategory.bind(null, numericId) as (
    prev: CategoryFormState,
    fd: FormData,
  ) => Promise<CategoryFormState>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title={row.nameTr}
        description={`Kategori düzenleme • /${row.slug}`}
        backHref="/panel/categories"
      />
      <CategoryForm mode="edit" category={row} action={boundAction} />
    </div>
  );
}
