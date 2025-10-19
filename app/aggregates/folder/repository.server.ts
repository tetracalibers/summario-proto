import { asc, eq, isNull, sql } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders } from "~/db/schema"

export const findAll = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}

export const findById = async (folderId: number) => {
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

export const findPath = async (folderId: number) => {
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
