import { eq, isNull, and, ne } from "drizzle-orm";
import { getDb, categories } from "@/lib/db";

async function main() {
  const db = getDb();

  const [existingRoot] = await db.select().from(categories).where(eq(categories.slug, "urunler")).limit(1);

  let rootId: number;
  if (existingRoot) {
    rootId = existingRoot.id;
    console.log(`root 'urunler' already exists (id=${rootId})`);
  } else {
    const [root] = await db
      .insert(categories)
      .values({
        slug: "urunler",
        nameTr: "Ürünler",
        nameEn: "Products",
        shortDescriptionTr: "Tüm ürün kategorilerimiz",
        shortDescriptionEn: "All our product categories",
        descriptionTr: "Ürün ailelerimiz — tüm alt kategoriler bu üst kategori altında toplanmıştır.",
        descriptionEn: "Our product families — all sub-categories are grouped under this top-level category.",
        parentId: null,
        sortOrder: -1,
      })
      .returning({ id: categories.id });
    rootId = root.id;
    console.log(`created root 'Ürünler' (id=${rootId})`);
  }

  const orphans = await db
    .select({ id: categories.id, slug: categories.slug })
    .from(categories)
    .where(and(isNull(categories.parentId), ne(categories.id, rootId)));

  if (orphans.length === 0) {
    console.log("no orphan categories to re-parent");
  } else {
    for (const o of orphans) {
      await db.update(categories).set({ parentId: rootId }).where(eq(categories.id, o.id));
      console.log(`moved '${o.slug}' under root`);
    }
    console.log(`re-parented ${orphans.length} categories`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
