import { eq } from "drizzle-orm";
import { getDb, categories } from "@/lib/db";

async function main() {
  const db = getDb();
  const [root] = await db.select().from(categories).where(eq(categories.slug, "urunler")).limit(1);
  if (!root) {
    console.log("no 'urunler' root found — nothing to do");
    return;
  }

  const children = await db.select().from(categories).where(eq(categories.parentId, root.id));
  console.log(`promoting ${children.length} children to top-level`);

  for (const c of children) {
    await db.update(categories).set({ parentId: null }).where(eq(categories.id, c.id));
    console.log(`  ${c.slug} → parent_id=NULL`);
  }

  await db.delete(categories).where(eq(categories.id, root.id));
  console.log("deleted 'urunler' root");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
