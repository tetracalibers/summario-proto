import { db } from "~/db/connection"
import { termAliases, terms } from "./schema"
import { eq, inArray, sql } from "drizzle-orm"

export const updateTermContent = async (termId: number, content: string) => {
  return db
    .update(terms)
    .set({ content })
    .where(eq(terms.id, termId))
    .returning({ id: terms.id, title: terms.title })
}

export const insertAliases = async (termId: number, aliases: string[]) => {
  if (aliases.length === 0) return []
  return db
    .insert(termAliases)
    .values(aliases.map((title) => ({ termId, title })))
    .returning({ id: termAliases.id, title: termAliases.title })
}

export const deleteAliases = async (aliasIds: number[]) => {
  if (aliasIds.length === 0) return []
  return db
    .delete(termAliases)
    .where(inArray(termAliases.id, aliasIds))
    .returning({ id: termAliases.id, title: termAliases.title })
}

export const insertTermEdges = async (
  termId: number,
  relatedTermIds: number[]
): Promise<{ id: number; title: string }[]> => {
  const values = relatedTermIds
    .map((relatedId) => {
      const [sourceTermId, targetTermId] =
        termId < relatedId ? [termId, relatedId] : [relatedId, termId]
      return `(${sourceTermId}, ${targetTermId})`
    })
    .join(", ")

  if (values.length === 0) return []

  const query = sql`INSERT INTO term_edges (source_term_id, target_term_id) VALUES ${sql.raw(values)} ON CONFLICT DO NOTHING RETURNING (SELECT id, title FROM terms WHERE terms.id = term_edges.source_term_id OR terms.id = term_edges.target_term_id)`
  return db.execute(query)
}

export const deleteTermEdges = async (
  termId: number,
  relatedTermIds: number[]
): Promise<{ id: number; title: string }[]> => {
  if (relatedTermIds.length === 0) return []

  const query = sql`DELETE FROM term_edges WHERE (source_term_id = ${termId} AND target_term_id IN (${sql.raw(relatedTermIds.join(", "))})) OR (target_term_id = ${termId} AND source_term_id IN (${sql.raw(relatedTermIds.join(", "))})) RETURNING (SELECT id, title FROM terms WHERE terms.id = term_edges.source_term_id OR terms.id = term_edges.target_term_id)`
  return db.execute(query)
}
