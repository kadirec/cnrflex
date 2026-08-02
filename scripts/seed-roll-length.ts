import { getDb, products } from "@/lib/db";
import { isNull } from "drizzle-orm";

async function main() {
  const db = getDb();
  const res = await db
    .update(products)
    .set({ rollLength: 50 })
    .where(isNull(products.rollLength));
  console.log("Updated rows:", (res as unknown as { rowCount?: number }).rowCount ?? "?");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
