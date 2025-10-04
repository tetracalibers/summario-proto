import { db } from "~/db/connection"
import { termAliases, termEdges, terms } from "./schema"
import { and, eq, inArray, or } from "drizzle-orm"

export const updateTermContent = async (termId: number, content: string) => {
  return db.update(terms).set({ content }).where(eq(terms.id, termId))
}

export const insertAliases = async (termId: number, aliases: string[]) => {
  return db.insert(termAliases).values(aliases.map((alias) => ({ termId, title: alias })))
}

export const deleteAliases = async (aliasIds: number[]) => {
  return db.delete(termAliases).where(inArray(termAliases.id, aliasIds))
}

export const insertTermEdges = async (termId: number, relatedTermIds: number[]) => {
  return db.insert(termEdges).values(
    relatedTermIds.map((relatedId) => {
      const [sourceTermId, targetTermId] =
        termId < relatedId ? [termId, relatedId] : [relatedId, termId]
      return { sourceTermId, targetTermId }
    })
  )
}

export const deleteTermEdges = async (termId: number, relatedTermIds: number[]) => {
  return db
    .delete(termEdges)
    .where(
      or(
        and(inArray(termEdges.sourceTermId, relatedTermIds), eq(termEdges.targetTermId, termId)),
        and(inArray(termEdges.targetTermId, relatedTermIds), eq(termEdges.sourceTermId, termId))
      )
    )
}
