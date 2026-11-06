import { neon } from "@neondatabase/serverless";

/** Verilen teklifler ve teklif ayarları tablolarını ekler (idempotent, mevcut tablolara dokunmaz). */
async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      id serial PRIMARY KEY,
      offer_date date NOT NULL,
      customer_name text NOT NULL,
      contact_person text,
      phone text,
      email text,
      address text,
      tax_office text,
      tax_number text,
      items jsonb NOT NULL DEFAULT '[]'::jsonb,
      settings jsonb NOT NULL,
      notes text,
      source_quote_id integer REFERENCES quotes(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS offer_defaults (
      id integer PRIMARY KEY DEFAULT 1,
      settings jsonb NOT NULL,
      notes text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM offers`;
  console.log("offers ve offer_defaults tabloları hazır, teklif sayısı:", n);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
