import { pgTable, serial, text, integer, timestamp, jsonb, boolean, uniqueIndex, type AnyPgColumn } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
    images: jsonb("images").$type<string[]>(),
    rollLength: integer("roll_length"),
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

export type QuoteType = "quote" | "contact" | "custom";
export type QuoteStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "won"
  | "lost"
  | "spam";

export type QuoteNote = {
  author: string;
  text: string;
  createdAt: string;
};

export type QuoteItem = {
  productId?: number;
  code: string;
  name: string;
  image?: string | null;
  categoryName?: string;
  categorySlug?: string;
  slug?: string;
  quantity?: string;
  note?: string;
  rollLength?: number | null;
  rollCount?: number | null;
};

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  type: text("type").$type<QuoteType>().notNull().default("quote"),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  categorySlug: text("category_slug"),
  categoryLabel: text("category_label"),
  customCategory: text("custom_category"),
  quantity: text("quantity"),
  message: text("message").notNull(),
  locale: text("locale").notNull().default("tr"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  status: text("status").$type<QuoteStatus>().notNull().default("new"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at", { withTimezone: true }),
  notes: jsonb("notes")
    .$type<QuoteNote[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  items: jsonb("items")
    .$type<QuoteItem[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactWhatsapp: text("contact_whatsapp"),
  addressTr: text("address_tr"),
  addressEn: text("address_en"),
  workingHoursTr: text("working_hours_tr"),
  workingHoursEn: text("working_hours_en"),
  mapEmbedUrl: text("map_embed_url"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  defaultMetaTitleTr: text("default_meta_title_tr"),
  defaultMetaTitleEn: text("default_meta_title_en"),
  defaultMetaDescriptionTr: text("default_meta_description_tr"),
  defaultMetaDescriptionEn: text("default_meta_description_en"),
  defaultOgImageUrl: text("default_og_image_url"),
  gaMeasurementId: text("ga_measurement_id"),
  gtmContainerId: text("gtm_container_id"),
  metaPixelId: text("meta_pixel_id"),
  headSnippet: text("head_snippet"),
  bodySnippet: text("body_snippet"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

export type BlogCategory =
  | "malzeme-rehberleri"
  | "uygulama-rehberleri"
  | "uretim-teknolojileri"
  | "satin-alma-rehberleri";

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: text("category").$type<BlogCategory>().notNull(),
  titleTr: text("title_tr").notNull(),
  titleEn: text("title_en").notNull(),
  excerptTr: text("excerpt_tr"),
  excerptEn: text("excerpt_en"),
  contentTr: text("content_tr").notNull(),
  contentEn: text("content_en").notNull(),
  coverImageUrl: text("cover_image_url"),
  author: text("author").notNull().default("CNR Seal"),
  readingTime: integer("reading_time").notNull().default(3),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
