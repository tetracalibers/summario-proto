import { eq, desc, asc, or, and, inArray, sql, ne, isNull } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, termAliases, termEdges, terms, type Term } from "~/db/schema"
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
    -- :folder_id が NULL ならルート直下、そうでなければそのフォルダ直下
    SELECT id, name, parent_id
    FROM ${folders}
    WHERE parent_id IS NOT DISTINCT FROM ${parentId}
    ORDER BY name;
  `

  const result = await db.execute<{ id: number; name: string; parent_id: number | null }>(query)
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

export const queryFolderContents = async (folderId: number | null) => {
  const query = sql`
    -- :folder_id が NULL ならルート直下、そうでなければそのフォルダ直下
    SELECT id, name, parent_id, 'folder' AS type
    FROM ${folders}
    WHERE parent_id IS NOT DISTINCT FROM ${folderId}
    
    UNION ALL

    SELECT id, title AS name, folder_id AS parent_id, 'file' AS type
    FROM ${terms}
    WHERE folder_id IS NOT DISTINCT FROM ${folderId}
    
    -- folderが先、同じtypeならname昇順
    ORDER BY type DESC, name;
  `

  const result = await db.execute<{
    id: number
    name: string
    parent_id: number | null
    type: "file" | "folder"
  }>(query)

  return result
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
