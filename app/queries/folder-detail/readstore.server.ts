import { sql } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, terms } from "~/db/schema"
import { debugLog } from "~/libs/debug.server"

export const findChildrenFolders = async (parentId: number | null) => {
  const query = sql`
    WITH folders_with_counts AS (
      SELECT
        f.id, f.name, f.parent_id,
        -- 直下のファイル数
        (SELECT COUNT(*) FROM ${terms} t WHERE t.folder_id = f.id)::int AS file_count,
        -- 直下のフォルダ数
        (SELECT COUNT(*) FROM ${folders} c WHERE c.parent_id = f.id)::int AS folder_count
      FROM ${folders} f
      WHERE f.parent_id IS NOT DISTINCT FROM ${parentId}
    )
  
    SELECT
      id, name, parent_id,
      (file_count + folder_count) AS entry_count
    FROM folders_with_counts
    ORDER BY name;
  `

  const result = await db.execute<{
    id: number
    name: string
    parent_id: number | null
    entry_count: number
  }>(query)

  debugLog(result)
  return result
}

export const findChildrenFiles = async (folderId: number | null) => {
  const query = sql`
    SELECT id, title AS name, folder_id AS parent_id
    FROM ${terms}
    WHERE folder_id IS NOT DISTINCT FROM ${folderId}
  `

  const result = await db.execute<{ id: number; name: string; parent_id: number | null }>(query)
  debugLog(result)

  return result
}
