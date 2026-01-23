import { neon } from "@neondatabase/serverless"
import contentSeed from "@/data/content.json"
import type { CmsContent } from "@/lib/cms"
import { normalizeContent } from "@/lib/cms"

const databaseUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL

const sql = databaseUrl ? neon(databaseUrl) : null

const seedContent = normalizeContent(contentSeed as CmsContent)

const ensureSchema = async () => {
  if (!sql) return
  await sql`
    CREATE TABLE IF NOT EXISTS cms_content (
      id text PRIMARY KEY,
      content jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `
}

export const isDatabaseConfigured = () => Boolean(sql)

export const loadCmsContent = async (): Promise<CmsContent> => {
  if (!sql) {
    return seedContent
  }

  await ensureSchema()
  let rows = await sql`SELECT content, updated_at FROM cms_content WHERE id = 'main' LIMIT 1`

  if (!rows || rows.length === 0) {
    const updatedAt = new Date().toISOString()
    const seeded = { ...seedContent, updatedAt }
    const payload = JSON.stringify(seeded)
    await sql`
      INSERT INTO cms_content (id, content, updated_at)
      VALUES ('main', ${payload}::jsonb, ${updatedAt})
      ON CONFLICT (id) DO NOTHING
    `
    rows = await sql`SELECT content, updated_at FROM cms_content WHERE id = 'main' LIMIT 1`
    if (!rows || rows.length === 0) {
      return seeded
    }
  }

  const row = rows[0] as { content: CmsContent; updated_at?: string | Date }
  const normalized = normalizeContent(row.content)
  if (!normalized.updatedAt && row.updated_at) {
    normalized.updatedAt = new Date(row.updated_at).toISOString()
  }
  return normalized
}

export const saveCmsContent = async (content: CmsContent): Promise<CmsContent> => {
  if (!sql) {
    throw new Error("Database is not configured.")
  }

  await ensureSchema()
  const updatedAt = new Date().toISOString()
  const payload = normalizeContent({ ...content, updatedAt })
  const serialized = JSON.stringify(payload)

  await sql`
    INSERT INTO cms_content (id, content, updated_at)
    VALUES ('main', ${serialized}::jsonb, ${updatedAt})
    ON CONFLICT (id)
    DO UPDATE SET content = EXCLUDED.content, updated_at = EXCLUDED.updated_at
  `

  return payload
}
