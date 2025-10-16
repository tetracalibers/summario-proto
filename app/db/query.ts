import { eq, desc, asc, or, and, sql, ne, isNull } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, termAliases, termEdges, terms } from "~/db/schema"
import { debugLog } from "~/lib/debug"

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

export const selectAllAliasByTermId = async (termId: number) => {
  return db
    .select({ id: termAliases.id, title: termAliases.title })
    .from(termAliases)
    .where(eq(termAliases.termId, termId))
}

export const selectAllFolders = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}

export const selectFolderById = async (folderId: number) => {
  return db
    .select({
      id: folders.id,
      name: folders.name,
      parentId: folders.parentId,
      isRoot: sql<boolean>`(${isNull(folders.id)})`.as("is_root")
    })
    .from(folders)
    .where(eq(folders.id, folderId))
}

export const queryFolderPath = async (folderId: number) => {
  const query = sql`
    WITH RECURSIVE chain AS (
      -- アンカー：ファイルの親フォルダ（葉側）
      SELECT fo.id, fo.parent_id, fo.name, 1 AS depth
      FROM ${folders} fo
      WHERE fo.id = ${folderId}

      UNION ALL
      
      -- 親へさかのぼる
      SELECT p.id, p.parent_id, p.name, c.depth + 1
      FROM ${folders} p
      JOIN chain c ON c.parent_id = p.id
    )

    SELECT id, name
    FROM chain
    ORDER BY depth DESC; -- ルート(最大depth) → … → 葉(最小depth)
  `

  const result = await db.execute<{ id: number; name: string }>(query)

  return result
}

export const selectChildrenFolders = async (parentId: number | null) => {
  const query = sql`
    SELECT
      f.id, f.name, f.parent_id,
      -- 直下にファイルもフォルダも無ければ is_empty: true
      (
        NOT EXISTS (SELECT 1 FROM ${terms}   fi WHERE fi.folder_id = f.id)
        AND
        NOT EXISTS (SELECT 1 FROM ${folders} cf WHERE cf.parent_id = f.id)
      ) AS is_empty
    FROM ${folders} f
    WHERE f.parent_id IS NOT DISTINCT FROM ${parentId}
    ORDER BY f.name;
  `

  const result = await db.execute<{
    id: number
    name: string
    parent_id: number | null
    is_empty: boolean
  }>(query)

  debugLog(result)
  return result
}

export const selectChildrenFiles = async (folderId: number | null) => {
  const query = sql`
    SELECT id, title AS name, folder_id AS parent_id
    FROM ${terms}
    WHERE folder_id IS NOT DISTINCT FROM ${folderId}
  `

  const result = await db.execute<{ id: number; name: string; parent_id: number | null }>(query)
  debugLog(result)

  return result
}

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
