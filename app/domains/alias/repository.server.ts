import { db } from "~/db/connection"
import { termAliases } from "~/db/schema"
import { eq, inArray } from "drizzle-orm"

export const findAllAliasesByTermId = async (termId: string) => {
  const rows = await db
    .select({ id: termAliases.id, title: termAliases.title })
    .from(termAliases)
    .where(eq(termAliases.termId, Number(termId)))

  return rows
}

export const insertAliases = async (termId: number, aliasLabels: string[]) => {
  if (aliasLabels.length === 0) return []
  return db
    .insert(termAliases)
    .values(aliasLabels.map((title) => ({ termId, title })))
    .returning({ id: termAliases.id, title: termAliases.title })
}

export const deleteAliases = async (aliasIds: number[]) => {
  if (aliasIds.length === 0) return []
  return db
    .delete(termAliases)
    .where(inArray(termAliases.id, aliasIds))
    .returning({ id: termAliases.id, title: termAliases.title })
}
