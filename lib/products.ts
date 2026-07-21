import "server-only";
import { asc } from "drizzle-orm";
import {
  getDb,
  categories as catT,
  products as prodT,
  ROOT_CATEGORY_SLUG,
  type ProductSpec,
} from "@/lib/db";
import type { Locale } from "@/lib/site";

export type Translated = Record<Locale, string>;

export type Product = {
  id: number;
  code: string;
  slug: string;
  name: Translated;
  description: Translated;
  image?: string | null;
  specs?: ProductSpec[] | null;
};

export type Category = {
  id: number;
  parentId: number | null;
  slug: string;
  name: Translated;
  shortDescription: Translated;
  description: Translated;
  image?: string | null;
  icon?: string | null;
  sortOrder: number;
  products: Product[];
  children: Category[];
};

type CatRow = typeof catT.$inferSelect;
type ProdRow = typeof prodT.$inferSelect;

function toProduct(p: ProdRow): Product {
  return {
    id: p.id,
    code: p.code,
    slug: p.slug,
    name: { tr: p.nameTr, en: p.nameEn },
    description: { tr: p.descriptionTr ?? "", en: p.descriptionEn ?? "" },
    image: p.imageUrl,
    specs: p.specs,
  };
}

async function loadAll() {
  const db = getDb();
  const [cats, prods] = await Promise.all([
    db.select().from(catT).orderBy(asc(catT.sortOrder), asc(catT.nameTr)),
    db.select().from(prodT).orderBy(asc(prodT.sortOrder), asc(prodT.nameTr)),
  ]);

  const productsByCategory = new Map<number, Product[]>();
  for (const p of prods) {
    const list = productsByCategory.get(p.categoryId) ?? [];
    list.push(toProduct(p));
    productsByCategory.set(p.categoryId, list);
  }

  const childrenByParent = new Map<number, CatRow[]>();
  const root = cats.find((c) => c.parentId === null && c.slug === ROOT_CATEGORY_SLUG);

  for (const c of cats) {
    if (c.parentId === null) continue;
    const list = childrenByParent.get(c.parentId) ?? [];
    list.push(c);
    childrenByParent.set(c.parentId, list);
  }

  const build = (row: CatRow): Category => {
    const children = (childrenByParent.get(row.id) ?? []).map(build);
    return {
      id: row.id,
      parentId: row.parentId,
      slug: row.slug,
      name: { tr: row.nameTr, en: row.nameEn },
      shortDescription: { tr: row.shortDescriptionTr ?? "", en: row.shortDescriptionEn ?? "" },
      description: { tr: row.descriptionTr ?? "", en: row.descriptionEn ?? "" },
      image: row.imageUrl,
      icon: row.iconUrl,
      sortOrder: row.sortOrder,
      products: productsByCategory.get(row.id) ?? [],
      children,
    };
  };

  return { root, cats, build };
}

export async function getTopCategories(): Promise<Category[]> {
  const { root, cats, build } = await loadAll();
  const topRows = root
    ? cats.filter((c) => c.parentId === root.id)
    : cats.filter((c) => c.parentId === null);
  return topRows.map(build);
}

export async function getAllCategoriesFlat(): Promise<Array<Category & { depth: number }>> {
  const tops = await getTopCategories();
  const out: Array<Category & { depth: number }> = [];
  const walk = (c: Category, depth: number) => {
    out.push({ ...c, depth });
    for (const ch of c.children) walk(ch, depth + 1);
  };
  for (const t of tops) walk(t, 0);
  return out;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const { root, cats, build } = await loadAll();
  const target = cats.find((c) => c.slug === slug);
  if (!target) return undefined;
  if (root && target.id === root.id) return undefined;
  return build(target);
}

export async function getProduct(
  categorySlug: string,
  productSlug: string,
): Promise<{ category: Category; product: Product } | undefined> {
  const category = await getCategory(categorySlug);
  if (!category) return undefined;
  const product = category.products.find((p) => p.slug === productSlug);
  if (!product) return undefined;
  return { category, product };
}

export async function getAllCategories(): Promise<Category[]> {
  return getTopCategories();
}
