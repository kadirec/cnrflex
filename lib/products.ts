import "server-only";
import { asc } from "drizzle-orm";
import { getDb, categories as catT, products as prodT, type ProductSpec } from "@/lib/db";
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
  slug: string;
  name: Translated;
  shortDescription: Translated;
  description: Translated;
  image?: string | null;
  icon?: string | null;
  products: Product[];
};

export async function getAllCategories(): Promise<Category[]> {
  const db = getDb();
  const [cats, prods] = await Promise.all([
    db.select().from(catT).orderBy(asc(catT.sortOrder), asc(catT.nameTr)),
    db.select().from(prodT).orderBy(asc(prodT.sortOrder), asc(prodT.nameTr)),
  ]);

  const byCategory = new Map<number, Product[]>();
  for (const p of prods) {
    const list = byCategory.get(p.categoryId) ?? [];
    list.push({
      id: p.id,
      code: p.code,
      slug: p.slug,
      name: { tr: p.nameTr, en: p.nameEn },
      description: { tr: p.descriptionTr ?? "", en: p.descriptionEn ?? "" },
      image: p.imageUrl,
      specs: p.specs,
    });
    byCategory.set(p.categoryId, list);
  }

  return cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: { tr: c.nameTr, en: c.nameEn },
    shortDescription: { tr: c.shortDescriptionTr ?? "", en: c.shortDescriptionEn ?? "" },
    description: { tr: c.descriptionTr ?? "", en: c.descriptionEn ?? "" },
    image: c.imageUrl,
    icon: c.iconUrl,
    products: byCategory.get(c.id) ?? [],
  }));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug);
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
