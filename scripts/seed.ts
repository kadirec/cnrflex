import { getDb, categories as categoriesTable, products as productsTable } from "@/lib/db";
import { categories as seedCategories } from "@/content/products";

async function main() {
  const db = getDb();

  const existing = await db.select({ id: categoriesTable.id }).from(categoriesTable).limit(1);
  if (existing.length > 0) {
    console.log("categories table already has data — skipping seed");
    return;
  }

  for (let ci = 0; ci < seedCategories.length; ci++) {
    const c = seedCategories[ci];
    const [inserted] = await db
      .insert(categoriesTable)
      .values({
        slug: c.slug,
        nameTr: c.name.tr,
        nameEn: c.name.en,
        shortDescriptionTr: c.shortDescription.tr,
        shortDescriptionEn: c.shortDescription.en,
        descriptionTr: c.description.tr,
        descriptionEn: c.description.en,
        imageUrl: c.image ?? null,
        iconUrl: c.icon ?? null,
        sortOrder: ci,
      })
      .returning({ id: categoriesTable.id });

    for (let pi = 0; pi < c.products.length; pi++) {
      const p = c.products[pi];
      await db.insert(productsTable).values({
        categoryId: inserted.id,
        code: p.code,
        slug: p.slug,
        nameTr: p.name.tr,
        nameEn: p.name.en,
        descriptionTr: p.description.tr,
        descriptionEn: p.description.en,
        imageUrl: p.image ?? null,
        specs: p.specs
          ? p.specs.map((s) => ({
              label: { tr: s.label.tr, en: s.label.en },
              value: { tr: s.value.tr, en: s.value.en },
            }))
          : null,
        sortOrder: pi,
      });
    }
    console.log(`seeded category ${c.slug} with ${c.products.length} products`);
  }
  console.log("seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
