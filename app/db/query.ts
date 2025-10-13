import { eq, desc, asc, or, and, inArray, sql, ne, isNull, isNotNull } from "drizzle-orm"
import { unionAll } from "drizzle-orm/pg-core"
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

export const queryFolderContents = async (folderId: number | null) => {
  // CTE: base（必ず base_path と base_id を1行で返す）
  // base_path: 末尾スラッシュ付き（例: "/", "/parent/child/"）
  const base = db.$with("base").as(
    db
      .select({
        basePath: sql<string>`
        CASE
          WHEN ${folderId}::int IS NULL THEN '/'::text
          ELSE (
            WITH RECURSIVE up AS (
              SELECT id, name, parent_id, name::text AS path
              FROM folders WHERE id = ${folderId}
              UNION ALL
              SELECT f.id, f.name, f.parent_id, (f.name || '/' || up.path)
              FROM folders f
              JOIN up ON up.parent_id = f.id
            )
            SELECT '/' || path || '/' FROM up
            WHERE parent_id IS NULL
            LIMIT 1
          )
        END
      `.as("base_path"),
        baseId: sql<number | null>`${folderId}::int`.as("base_id")
      })
      .from(folders)
      .limit(1) // 直下のアイテムを見たいフォルダのみ
  )

  // 直下のフォルダ
  const selectFolders = db
    .with(base)
    .select({
      id: folders.id,
      name: folders.name,
      fullPath: sql<string>`${base.basePath} || ${folders.name}`.as("full_path"),
      type: sql<"file" | "folder">`'folder'`.as("type"),
      parentId: folders.parentId
    })
    .from(base)
    .innerJoin(
      folders,
      or(
        and(isNull(base.baseId), isNull(folders.parentId)), // ルート直下
        and(isNotNull(base.baseId), eq(folders.parentId, base.baseId)) // base_id が非NULLなら親一致
      )
    )

  // 直下のファイル（ルート直下にファイルを許容する設計に対応）
  const selectFiles = db
    .with(base)
    .select({
      id: terms.id,
      name: terms.title,
      fullPath: sql<string>`${base.basePath} || ${terms.title}`.as("full_path"),
      type: sql<"file" | "folder">`'file'`.as("type"),
      parentId: terms.folderId
    })
    .from(base)
    .innerJoin(
      terms,
      or(
        and(isNull(base.baseId), isNull(terms.folderId)), // ルート直下
        and(isNotNull(base.baseId), eq(terms.folderId, base.baseId)) // base_id が非NULLなら親一致
      )
    )

  const combined = unionAll(selectFolders, selectFiles).as("u")

  const rows = await db
    .select({
      id: combined.id,
      name: combined.name,
      fullPath: combined.fullPath,
      type: combined.type,
      parentId: combined.parentId
    })
    .from(combined)
    // folderが先、同じtypeならname昇順
    .orderBy(desc(combined.type), asc(combined.name))

  return rows
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
