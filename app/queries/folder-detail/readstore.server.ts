import { sql } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, terms } from "~/db/schema"
import { debugLog } from "~/libs/debug"

export const findChildrenFolders = async (parentId: number | null) => {
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
