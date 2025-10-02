import { eq, desc, asc, or, and, inArray, sql, ne } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, termAliases, termEdges, terms, type Term } from "~/db/schema"

export const selectTermById = async (id: number) => {
  return db.select().from(terms).where(eq(terms.id, id))
}

export const selectRecentTerm = async (limit = 1) => {
  return db.select().from(terms).orderBy(desc(terms.updatedAt)).limit(limit)
}

export const selectAllTerms = async () => {
  return await db.select().from(terms)
}

export const selectTermsWithoutId = async (excludeId: number) => {
  return db.select().from(terms).where(ne(terms.id, excludeId)).orderBy(desc(terms.updatedAt))
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

export const selectAllAliasByTermId = async (termId: number) => {
  return db
    .select({ id: termAliases.id, title: termAliases.title })
    .from(termAliases)
    .where(eq(termAliases.termId, termId))
}

// その用語が所属するフォルダのパスを表すフォルダidの配列を取得
export const queryTermPath = async (term: Term): Promise<string[] | null> => {
  if (!term.folderId) return null

  const query = sql`
    WITH RECURSIVE folder_path(id, parent_id, depth) AS (
      SELECT
        id,
        parent_id,
        1
      FROM ${folders}
      WHERE id = ${term.folderId}
      UNION ALL
      SELECT
        f.id,
        f.parent_id,
        fp.depth + 1
      FROM ${folders} f
      JOIN folder_path fp ON f.id = fp.parent_id
    )
    SELECT id FROM folder_path ORDER BY depth DESC
  `
  const result = await db.execute<{ id: string }>(query)

  return result.map((row) => row.id)
}

export const selectAllFolders = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}

export const selectOutgoingEdgesBySourceIds = async (sourceIds: number[]) => {
  if (sourceIds.length === 0) return []
  return db
    .select({
      sourceTermId: termEdges.sourceTermId,
      targetTermId: termEdges.targetTermId
    })
    .from(termEdges)
    .where(inArray(termEdges.sourceTermId, sourceIds))
}

// termId を含むすべてのエッジを取得
// export const selectAllEdgesByTermId = async (termId: number) => {
//   return db
//     .select()
//     .from(termEdges)
//     .where(or(eq(termEdges.sourceTermId, termId), eq(termEdges.targetTermId, termId)))
// }

// centerIdの関連ノード（双方向）をすべて取得
export const selectAllRelatedTerms = async (centerId: number) => {
  return db
    .select({ id: terms.id, title: terms.title })
    .from(terms)
    .innerJoin(
      termEdges,
      or(
        and(eq(termEdges.sourceTermId, terms.id), eq(termEdges.targetTermId, centerId)),
        and(eq(termEdges.targetTermId, terms.id), eq(termEdges.sourceTermId, centerId))
      )
    )
}

// export const selectAllRelatedTerms = async (relatedTermIds: number[]) => {
//   return db
//     .select()
//     .from(terms)
//     .where(and(or(...relatedTermIds.map((id) => eq(terms.id, id)))))
// }
