import { eq, desc, asc, or, and } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, termAliases, termEdges, terms } from "~/db/schema"

export const selectTermById = async (id: number) => {
  return db.select().from(terms).where(eq(terms.id, id))
}

export const selectRecentTerm = async (limit = 1) => {
  return db.select().from(terms).orderBy(desc(terms.updatedAt)).limit(limit)
}

export const selectAllTerms = async () => {
  return await db.select().from(terms)
}

export const selectAllTermsAndAlias = async () => {
  return db
    .select({
      id: terms.id,
      title: terms.title,
      alias: termAliases.title
    })
    .from(terms)
    .leftJoin(termAliases, eq(termAliases.termId, terms.id))
    .orderBy(desc(terms.updatedAt))
}

export const selectAllFolders = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}

// termId を含むすべてのエッジを取得
export const selectAllEdgesByTermId = async (termId: number) => {
  return db
    .select()
    .from(termEdges)
    .where(or(eq(termEdges.sourceTermId, termId), eq(termEdges.targetTermId, termId)))
}

export const selectAllRelatedTerms = async (relatedTermIds: number[]) => {
  return db
    .select()
    .from(terms)
    .where(and(or(...relatedTermIds.map((id) => eq(terms.id, id)))))
}
