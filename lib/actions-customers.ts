"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import "@/lib/zod-tr";
import { getSession } from "@/lib/auth";
import { getDb, customers, customerSales, customerPayments } from "@/lib/db";
import { computeSale } from "@/lib/customer-calc";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih");
const money = (min: number) => z.number().finite().min(min).max(100_000_000);

async function authed() {
  const session = await getSession();
  return Boolean(session.userId);
}

function firstError(e: z.ZodError) {
  return e.issues[0]?.message ?? "Geçersiz veri";
}

function revalidateCustomer(id?: number) {
  revalidatePath("/panel/customers");
  if (id) revalidatePath(`/panel/customers/${id}`);
}

/* ───── Cari ───── */

const customerSchema = z.object({
  kind: z.enum(["customer", "supplier"]).default("customer"),
  code: optText(120),
  name: z.string().trim().min(1, "Firma adı zorunlu").max(200),
  contacts: z
    .array(z.object({ name: z.string().trim().max(120), phone: z.string().trim().max(60) }))
    .max(10)
    .transform((xs) => xs.filter((c) => c.name || c.phone)),
  email: optText(200),
  city: optText(120),
  address: optText(1000),
  taxOffice: optText(200),
  taxNumber: optText(60),
  notes: optText(4000),
});

export type CustomerInput = z.input<typeof customerSchema>;

export async function saveCustomer(input: CustomerInput, id?: number): Promise<Result<{ id: number }>> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const db = getDb();

  if (id) {
    const res = await db
      .update(customers)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning({ id: customers.id });
    if (res.length === 0) return { ok: false, error: "Cari bulunamadı" };
    revalidateCustomer(id);
    return { ok: true, id };
  }
  const [row] = await db.insert(customers).values(parsed.data).returning({ id: customers.id });
  revalidateCustomer();
  return { ok: true, id: row.id };
}

export async function deleteCustomer(id: number): Promise<Result> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  await getDb().delete(customers).where(eq(customers.id, id));
  revalidateCustomer();
  return { ok: true };
}

/* ───── Satış / Sipariş ───── */

const saleSchema = z.object({
  saleDate: isoDate,
  kind: z.enum(["sale", "return"]),
  status: z.enum(["order", "delivered", "cancelled"]),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive().nullable().optional(),
        code: z.string().trim().max(80),
        name: z.string().trim().min(1, "Ürün adı / açıklama boş olamaz").max(300),
        unit: z.enum(["MT", "ADET", "KG", "TOP"]),
        quantity: money(0),
        unitPrice: money(0),
      }),
    )
    .min(1, "En az bir kalem ekleyin")
    .max(100),
  vatRate: z.number().finite().min(0).max(100),
  notes: optText(4000),
  sourceOfferId: z.number().int().positive().nullable().optional(),
});

export type SaleInput = z.input<typeof saleSchema>;

export async function saveSale(customerId: number, input: SaleInput, id?: number): Promise<Result<{ id: number }>> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const parsed = saleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const data = { ...parsed.data, ...computeSale(parsed.data.items, parsed.data.vatRate) };
  const db = getDb();

  let savedId = id;
  if (id) {
    const res = await db
      .update(customerSales)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customerSales.id, id))
      .returning({ id: customerSales.id });
    if (res.length === 0) return { ok: false, error: "Satış bulunamadı" };
  } else {
    const [row] = await db
      .insert(customerSales)
      .values({ ...data, customerId })
      .returning({ id: customerSales.id });
    savedId = row.id;
  }
  revalidateCustomer(customerId);
  return { ok: true, id: savedId! };
}

export async function setSaleStatus(id: number, status: "order" | "delivered" | "cancelled"): Promise<Result> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const [row] = await getDb()
    .update(customerSales)
    .set({ status, updatedAt: new Date() })
    .where(eq(customerSales.id, id))
    .returning({ customerId: customerSales.customerId });
  if (!row) return { ok: false, error: "Satış bulunamadı" };
  revalidateCustomer(row.customerId);
  return { ok: true };
}

export async function deleteSale(id: number): Promise<Result> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const [row] = await getDb()
    .delete(customerSales)
    .where(eq(customerSales.id, id))
    .returning({ customerId: customerSales.customerId });
  revalidateCustomer(row?.customerId);
  return { ok: true };
}

/* ───── Ödeme ───── */

const paymentSchema = z
  .object({
    customerId: z.number().int().positive("Cari seçin"),
    paymentDate: isoDate,
    amount: money(0.01),
    method: z.enum(["transfer", "cash", "card", "check", "note", "other"]),
    dueDate: isoDate.nullable().optional(),
    documentNo: optText(120),
    description: optText(1000),
  })
  .transform((p) => ({ ...p, dueDate: p.method === "check" || p.method === "note" ? (p.dueDate ?? null) : null }));

export type PaymentInput = z.input<typeof paymentSchema>;

export async function savePayment(input: PaymentInput, id?: number): Promise<Result<{ id: number }>> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const db = getDb();

  let savedId = id;
  if (id) {
    const res = await db
      .update(customerPayments)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(customerPayments.id, id))
      .returning({ id: customerPayments.id });
    if (res.length === 0) return { ok: false, error: "Ödeme bulunamadı" };
  } else {
    const [row] = await db.insert(customerPayments).values(parsed.data).returning({ id: customerPayments.id });
    savedId = row.id;
  }
  revalidateCustomer(parsed.data.customerId);
  return { ok: true, id: savedId! };
}

export async function deletePayment(id: number): Promise<Result> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz" };
  const [row] = await getDb()
    .delete(customerPayments)
    .where(eq(customerPayments.id, id))
    .returning({ customerId: customerPayments.customerId });
  revalidateCustomer(row?.customerId);
  return { ok: true };
}
