import { pgTable, serial, text, integer, timestamp, jsonb, uniqueIndex, type AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references((): AnyPgColumn => categories.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  nameTr: text("name_tr").notNull(),
  nameEn: text("name_en").notNull(),
  shortDescriptionTr: text("short_description_tr"),
  shortDescriptionEn: text("short_description_en"),
  descriptionTr: text("description_tr"),
  descriptionEn: text("description_en"),
  imageUrl: text("image_url"),
  iconUrl: text("icon_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductSpec = {
  label: { tr: string; en: string };
  value: { tr: string; en: string };
};

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    slug: text("slug").notNull(),
    nameTr: text("name_tr").notNull(),
    nameEn: text("name_en").notNull(),
    descriptionTr: text("description_tr"),
    descriptionEn: text("description_en"),
    imageUrl: text("image_url"),
    specs: jsonb("specs").$type<ProductSpec[]>(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("products_category_slug_idx").on(t.categoryId, t.slug)],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
