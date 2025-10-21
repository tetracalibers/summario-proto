import { sql } from "drizzle-orm"
import { db } from "~/db/connection"
import { terms } from "~/db/schema"
import { debugLog } from "~/libs/debug.server"

/**
 * excludeId を除外しつつ、フォルダ「近さ」順で並べ替える
 * - folderId が null の場合は、folderId が null の用語を最優先
 * - folderId が非 null の場合は、その folderId と一致する用語を最優先
 * セカンダリ：folderId 昇順 → title 降順
 */
export const findSortedByFolderProximityExcluding = async (
  excludeTermId: number,
  currentFolderId: number | null
) => {
  const query = sql`
    SELECT id, title
    FROM ${terms}
    WHERE id <> ${excludeTermId}
    ORDER BY
      CASE
        WHEN ${currentFolderId}::int IS NULL AND folder_id IS NULL THEN 0
        WHEN ${currentFolderId}::int IS NOT NULL AND folder_id = ${currentFolderId} THEN 0
        ELSE 1
      END,
      folder_id;
  `

  const rows = await db.execute<{ id: number; title: string }>(query)
  debugLog(rows)

  return rows
}
