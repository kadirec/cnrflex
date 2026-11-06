import { pgTable, serial, text, integer, timestamp, jsonb, boolean, uniqueIndex, index, numeric, date, type AnyPgColumn } from "drizzle-orm/pg-core";
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

export type OfferItem = {
  productId?: number | null;
  code: string;
  name: string;
  image?: string | null;
  /** Sipariş miktarı (metre) */
  quantity: number;
  /** Paket içerik bilgisi (metre) */
  packageSize?: number | null;
  /** KDV hariç peşin birim fiyat */
  unitPrice: number;
  /** Taksit sayısına göre elle girilmiş kart birim fiyatı (boşsa orandan hesaplanır) */
  cardPrices?: Record<string, number>;
};

export type OfferInstallment = {
  count: number;
  /** Peşin fiyata eklenecek yüzde */
  rate: number;
};

export type OfferDeferredLabel = "Senet" | "Çek";

export type OfferSettings = {
  vatRate: number;
  showCard: boolean;
  installments: OfferInstallment[];
  showDeferred: boolean;
  deferredLabel: OfferDeferredLabel;
  monthlyRate: number;
  downPaymentRate: number;
  termDays: number[];
  transferDiscount: number;
};

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  offerDate: date("offer_date", { mode: "string" }).notNull(),
  customerName: text("customer_name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  taxOffice: text("tax_office"),
  taxNumber: text("tax_number"),
  items: jsonb("items")
    .$type<OfferItem[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  settings: jsonb("settings").$type<OfferSettings>().notNull(),
  notes: text("notes"),
  sourceQuoteId: integer("source_quote_id").references(() => quotes.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

/** Yeni tekliflerin başlangıç değerleri (tek satır, id = 1) */
export const offerDefaults = pgTable("offer_defaults", {
  id: integer("id").primaryKey().default(1),
  settings: jsonb("settings").$type<OfferSettings>().notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OfferDefaults = typeof offerDefaults.$inferSelect;

/* ───────────── Cariler ───────────── */

export type CustomerKind = "customer" | "supplier";

export type CustomerContact = { name: string; phone: string };

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  /** Satış carisi (müşteri) veya alış carisi (tedarikçi) */
  kind: text("kind").$type<CustomerKind>().notNull().default("customer"),
  /** Cari kodu, örn. "GÜVENİŞ KEPENK-4" */
  code: text("code"),
  name: text("name").notNull(),
  contacts: jsonb("contacts")
    .$type<CustomerContact[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  email: text("email"),
  city: text("city"),
  address: text("address"),
  taxOffice: text("tax_office"),
  taxNumber: text("tax_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type SaleKind = "sale" | "return";
/** order: sipariş alındı, henüz gönderilmedi (bakiyeye yansımaz) · delivered: teslim edildi · cancelled: iptal */
export type SaleStatus = "order" | "delivered" | "cancelled";
export type SaleUnit = "MT" | "ADET" | "KG" | "TOP";

export type SaleItem = {
  productId?: number | null;
  code: string;
  name: string;
  unit: SaleUnit;
  quantity: number;
  /** KDV hariç birim fiyat */
  unitPrice: number;
};

export const customerSales = pgTable(
  "customer_sales",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    saleDate: date("sale_date", { mode: "string" }).notNull(),
    kind: text("kind").$type<SaleKind>().notNull().default("sale"),
    status: text("status").$type<SaleStatus>().notNull().default("delivered"),
    items: jsonb("items")
      .$type<SaleItem[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    vatRate: numeric("vat_rate", { precision: 5, scale: 2, mode: "number" }).notNull().default(0),
    subtotal: numeric("subtotal", { precision: 14, scale: 2, mode: "number" }).notNull().default(0),
    vatTotal: numeric("vat_total", { precision: 14, scale: 2, mode: "number" }).notNull().default(0),
    total: numeric("total", { precision: 14, scale: 2, mode: "number" }).notNull().default(0),
    notes: text("notes"),
    sourceOfferId: integer("source_offer_id").references(() => offers.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("customer_sales_customer_idx").on(t.customerId, t.saleDate)],
);

export type CustomerSale = typeof customerSales.$inferSelect;
export type NewCustomerSale = typeof customerSales.$inferInsert;

export type PaymentMethod = "transfer" | "cash" | "card" | "check" | "note" | "other";

export const customerPayments = pgTable(
  "customer_payments",
  {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    paymentDate: date("payment_date", { mode: "string" }).notNull(),
    amount: numeric("amount", { precision: 14, scale: 2, mode: "number" }).notNull(),
    method: text("method").$type<PaymentMethod>().notNull().default("transfer"),
    /** Çek / senet vadesi */
    dueDate: date("due_date", { mode: "string" }),
    documentNo: text("document_no"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("customer_payments_customer_idx").on(t.customerId, t.paymentDate)],
);

export type CustomerPayment = typeof customerPayments.$inferSelect;
export type NewCustomerPayment = typeof customerPayments.$inferInsert;

export const customersRelations = relations(customers, ({ many }) => ({
  sales: many(customerSales),
  payments: many(customerPayments),
}));

export const customerSalesRelations = relations(customerSales, ({ one }) => ({
  customer: one(customers, { fields: [customerSales.customerId], references: [customers.id] }),
}));

export const customerPaymentsRelations = relations(customerPayments, ({ one }) => ({
  customer: one(customers, { fields: [customerPayments.customerId], references: [customers.id] }),
}));
