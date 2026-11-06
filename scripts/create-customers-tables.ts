import { neon } from "@neondatabase/serverless";

/** Cariler, cari satışları ve ödemeler tablolarını ekler (idempotent, mevcut tablolara dokunmaz). */
async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id serial PRIMARY KEY,
      kind text NOT NULL DEFAULT 'customer',
      code text,
      name text NOT NULL,
      contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
      email text,
      city text,
      address text,
      tax_office text,
      tax_number text,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS customer_sales (
      id serial PRIMARY KEY,
      customer_id integer NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      sale_date date NOT NULL,
      kind text NOT NULL DEFAULT 'sale',
      status text NOT NULL DEFAULT 'delivered',
      items jsonb NOT NULL DEFAULT '[]'::jsonb,
      vat_rate numeric(5,2) NOT NULL DEFAULT 0,
      subtotal numeric(14,2) NOT NULL DEFAULT 0,
      vat_total numeric(14,2) NOT NULL DEFAULT 0,
      total numeric(14,2) NOT NULL DEFAULT 0,
      notes text,
      source_offer_id integer REFERENCES offers(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS customer_sales_customer_idx ON customer_sales (customer_id, sale_date)`;
  await sql`
    CREATE TABLE IF NOT EXISTS customer_payments (
      id serial PRIMARY KEY,
      customer_id integer NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      payment_date date NOT NULL,
      amount numeric(14,2) NOT NULL,
      method text NOT NULL DEFAULT 'transfer',
      due_date date,
      document_no text,
      description text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS customer_payments_customer_idx ON customer_payments (customer_id, payment_date)`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM customers`;
  console.log("customers, customer_sales, customer_payments tabloları hazır, cari sayısı:", n);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
