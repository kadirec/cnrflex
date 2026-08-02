import "server-only";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, quotes, type Quote, type QuoteStatus } from "@/lib/db";

export type ListQuotesInput = {
  status?: QuoteStatus;
  onlyUnread?: boolean;
  q?: string;
  limit?: number;
};

export async function listQuotes(input: ListQuotesInput = {}): Promise<Quote[]> {
  const db = getDb();
  const conditions = [];

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

export async function countByStatus(): Promise<Record<QuoteStatus, number>> {
  const db = getDb();
  const rows = await db
    .select({ status: quotes.status, n: sql<number>`count(*)::int` })
    .from(quotes)
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
