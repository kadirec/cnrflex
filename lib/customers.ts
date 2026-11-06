import "server-only";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import {
  getDb,
  customers,
  customerSales,
  customerPayments,
  type Customer,
  type CustomerKind,
  type CustomerPayment,
  type CustomerSale,
  type SaleStatus,
} from "@/lib/db";

export type CustomerSummary = {
  /** Teslim edilen satışlar (KDV dahil) */
  salesTotal: number;
  returnsTotal: number;
  paymentsTotal: number;
  /** Bekleyen siparişler — bakiyeye dahil değil */
  pendingOrdersTotal: number;
  /** + borç (cari bize borçlu), − alacak */
  balance: number;
  lastActivity: string | null;
};

export type CustomerListRow = Customer & CustomerSummary;

const salesAgg = sql<number>`coalesce((select sum(s.total) from customer_sales s where s.customer_id = ${customers.id} and s.status = 'delivered' and s.kind = 'sale'), 0)::float8`;
const returnsAgg = sql<number>`coalesce((select sum(s.total) from customer_sales s where s.customer_id = ${customers.id} and s.status = 'delivered' and s.kind = 'return'), 0)::float8`;
const pendingAgg = sql<number>`coalesce((select sum(s.total) from customer_sales s where s.customer_id = ${customers.id} and s.status = 'order'), 0)::float8`;
const paymentsAgg = sql<number>`coalesce((select sum(p.amount) from customer_payments p where p.customer_id = ${customers.id}), 0)::float8`;
const lastActivityAgg = sql<string | null>`greatest(
  (select max(s.sale_date) from customer_sales s where s.customer_id = ${customers.id}),
  (select max(p.payment_date) from customer_payments p where p.customer_id = ${customers.id})
)::text`;

function withBalance<T extends { salesTotal: number; returnsTotal: number; paymentsTotal: number }>(r: T) {
  return { ...r, balance: Math.round((r.salesTotal - r.returnsTotal - r.paymentsTotal) * 100) / 100 };
}

export async function listCustomers(
  input: { q?: string; kind?: CustomerKind; onlyDebtors?: boolean } = {},
): Promise<CustomerListRow[]> {
  const conds: SQL[] = [eq(customers.kind, input.kind ?? "customer")];
  if (input.q) {
    const like = `%${input.q}%`;
    conds.push(
      or(
        ilike(customers.name, like),
        ilike(customers.code, like),
        ilike(customers.city, like),
        sql`${customers.contacts}::text ilike ${like}`,
      )!,
    );
  }
  const rows = await getDb()
    .select({
      customer: customers,
      salesTotal: salesAgg,
      returnsTotal: returnsAgg,
      pendingOrdersTotal: pendingAgg,
      paymentsTotal: paymentsAgg,
      lastActivity: lastActivityAgg,
    })
    .from(customers)
    .where(and(...conds))
    .orderBy(asc(customers.name));
  const list = rows.map(({ customer, ...agg }) => withBalance({ ...customer, ...agg }));
  return input.onlyDebtors ? list.filter((r) => r.balance > 0.009) : list;
}

export async function countCustomers(kind: CustomerKind = "customer"): Promise<number> {
  try {
    const [row] = await getDb()
      .select({ n: sql<number>`count(*)::int` })
      .from(customers)
      .where(eq(customers.kind, kind));
    return row?.n ?? 0;
  } catch (e) {
    console.error("customers sayılamadı", e);
    return 0;
  }
}

export async function getCustomer(id: number): Promise<Customer | undefined> {
  const [row] = await getDb().select().from(customers).where(eq(customers.id, id)).limit(1);
  return row;
}

export type CustomerOption = { id: number; name: string; code: string | null };

export async function listCustomerOptions(kind: CustomerKind = "customer"): Promise<CustomerOption[]> {
  return getDb()
    .select({ id: customers.id, name: customers.name, code: customers.code })
    .from(customers)
    .where(eq(customers.kind, kind))
    .orderBy(asc(customers.name));
}

export async function getCustomerAccount(id: number): Promise<{
  sales: CustomerSale[];
  payments: CustomerPayment[];
  summary: CustomerSummary;
}> {
  const db = getDb();
  const [sales, payments] = await Promise.all([
    db
      .select()
      .from(customerSales)
      .where(eq(customerSales.customerId, id))
      .orderBy(asc(customerSales.saleDate), asc(customerSales.createdAt)),
    db
      .select()
      .from(customerPayments)
      .where(eq(customerPayments.customerId, id))
      .orderBy(asc(customerPayments.paymentDate), asc(customerPayments.createdAt)),
  ]);
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const delivered = sales.filter((s) => s.status === "delivered");
  const dates = [...sales.map((s) => s.saleDate), ...payments.map((p) => p.paymentDate)].sort();
  const summary = withBalance({
    salesTotal: sum(delivered.filter((s) => s.kind === "sale").map((s) => s.total)),
    returnsTotal: sum(delivered.filter((s) => s.kind === "return").map((s) => s.total)),
    paymentsTotal: sum(payments.map((p) => p.amount)),
    pendingOrdersTotal: sum(sales.filter((s) => s.status === "order").map((s) => s.total)),
    lastActivity: dates.at(-1) ?? null,
  });
  return { sales, payments, summary };
}

export async function getSale(id: number): Promise<CustomerSale | undefined> {
  const [row] = await getDb().select().from(customerSales).where(eq(customerSales.id, id)).limit(1);
  return row;
}

export type SaleListRow = CustomerSale & { customerName: string; customerCode: string | null };

export async function listAllSales(
  input: { q?: string; status?: SaleStatus; kind?: CustomerKind } = {},
): Promise<SaleListRow[]> {
  const conds: SQL[] = [eq(customers.kind, input.kind ?? "customer")];
  if (input.status) conds.push(eq(customerSales.status, input.status));
  if (input.q) {
    const like = `%${input.q}%`;
    conds.push(
      or(ilike(customers.name, like), ilike(customers.code, like), sql`${customerSales.items}::text ilike ${like}`)!,
    );
  }
  const rows = await getDb()
    .select({ sale: customerSales, customerName: customers.name, customerCode: customers.code })
    .from(customerSales)
    .innerJoin(customers, eq(customerSales.customerId, customers.id))
    .where(and(...conds))
    .orderBy(desc(customerSales.saleDate), desc(customerSales.createdAt))
    .limit(500);
  return rows.map((r) => ({ ...r.sale, customerName: r.customerName, customerCode: r.customerCode }));
}

export type PaymentListRow = CustomerPayment & { customerName: string; customerCode: string | null };

export async function listAllPayments(
  input: { q?: string; kind?: CustomerKind } = {},
): Promise<PaymentListRow[]> {
  const kindCond = eq(customers.kind, input.kind ?? "customer");
  const where = input.q
    ? and(
        kindCond,
        or(
          ilike(customers.name, `%${input.q}%`),
          ilike(customers.code, `%${input.q}%`),
          ilike(customerPayments.description, `%${input.q}%`),
          ilike(customerPayments.documentNo, `%${input.q}%`),
        ),
      )
    : kindCond;
  const rows = await getDb()
    .select({ payment: customerPayments, customerName: customers.name, customerCode: customers.code })
    .from(customerPayments)
    .innerJoin(customers, eq(customerPayments.customerId, customers.id))
    .where(where)
    .orderBy(desc(customerPayments.paymentDate), desc(customerPayments.createdAt))
    .limit(500);
  return rows.map((r) => ({ ...r.payment, customerName: r.customerName, customerCode: r.customerCode }));
}

export async function countSalesAndPayments(
  kind: CustomerKind = "customer",
): Promise<{ sales: number; payments: number }> {
  try {
    const db = getDb();
    const [[s], [p]] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(customerSales)
        .innerJoin(customers, eq(customerSales.customerId, customers.id))
        .where(eq(customers.kind, kind)),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(customerPayments)
        .innerJoin(customers, eq(customerPayments.customerId, customers.id))
        .where(eq(customers.kind, kind)),
    ]);
    return { sales: s?.n ?? 0, payments: p?.n ?? 0 };
  } catch (e) {
    console.error("satış/ödeme sayılamadı", e);
    return { sales: 0, payments: 0 };
  }
}
