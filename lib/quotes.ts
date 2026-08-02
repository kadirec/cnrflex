import "server-only";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb, quotes, type Quote, type QuoteStatus, type QuoteType } from "@/lib/db";

export type QuoteGroup = "list" | "custom";

const GROUP_TYPES: Record<QuoteGroup, QuoteType[]> = {
  list: ["quote", "contact"],
  custom: ["custom"],
};

export type ListQuotesInput = {
  status?: QuoteStatus;
  onlyUnread?: boolean;
  q?: string;
  limit?: number;
  group?: QuoteGroup;
};

export async function listQuotes(input: ListQuotesInput = {}): Promise<Quote[]> {
  const db = getDb();
  const conditions = [];

  if (input.group) conditions.push(inArray(quotes.type, GROUP_TYPES[input.group]));
  if (input.status) conditions.push(eq(quotes.status, input.status));
  if (input.onlyUnread) conditions.push(eq(quotes.isRead, false));
  if (input.q) {
    const like = `%${input.q}%`;
    conditions.push(
      or(
        ilike(quotes.name, like),
        ilike(quotes.email, like),
        ilike(quotes.company, like),
        ilike(quotes.message, like),
      ),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(quotes)
    .where(where)
    .orderBy(desc(quotes.createdAt))
    .limit(input.limit ?? 200);
}

export async function getQuote(id: number): Promise<Quote | undefined> {
  const db = getDb();
  const [row] = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  return row;
}

export async function countUnread(): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(quotes)
    .where(eq(quotes.isRead, false));
  return row?.n ?? 0;
}

export async function countByStatus(group?: QuoteGroup): Promise<Record<QuoteStatus, number>> {
  const db = getDb();
  const where = group ? inArray(quotes.type, GROUP_TYPES[group]) : undefined;
  const rows = await db
    .select({ status: quotes.status, n: sql<number>`count(*)::int` })
    .from(quotes)
    .where(where)
    .groupBy(quotes.status);
  const out = { new: 0, contacted: 0, in_progress: 0, won: 0, lost: 0, spam: 0 } as Record<
    QuoteStatus,
    number
  >;
  for (const r of rows) {
    out[r.status as QuoteStatus] = r.n;
  }
  return out;
}

export async function countByGroup(): Promise<Record<QuoteGroup, number>> {
  const db = getDb();
  const rows = await db
    .select({ type: quotes.type, n: sql<number>`count(*)::int` })
    .from(quotes)
    .groupBy(quotes.type);
  const out: Record<QuoteGroup, number> = { list: 0, custom: 0 };
  for (const r of rows) {
    if (r.type === "custom") out.custom += r.n;
    else out.list += r.n;
  }
  return out;
}

export function isQuoteGroup(v: string): v is QuoteGroup {
  return v === "list" || v === "custom";
}
