import type { TreeNodeData } from "@mantine/core"
import { asc, isNotNull } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, terms } from "~/db/schema"

type Folder = typeof folders.$inferSelect
type Term = typeof terms.$inferSelect

const raw2TreeNodeData = (folder: Folder): TreeNodeData => ({
  value: folder.id.toString(),
  label: folder.name,
  children: []
})

function buildFolderTree(rows: Folder[], terms: Term[]): TreeNodeData[] {
  const byId = new Map<number, TreeNodeData>()
  const roots: TreeNodeData[] = []

  for (const r of rows) byId.set(r.id, raw2TreeNodeData(r))
  for (const t of terms) {
    const parent = byId.get(t.folderId!)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push({
        value: `term-${t.id}`,
        label: t.title,
        children: []
      })
    }
  }

  for (const r of rows) {
    const node = byId.get(r.id)!
    if (r.parentId == null) {
      roots.push(node)
    } else {
      const parent = byId.get(r.parentId)
      if (parent) parent.children?.push(node)
      else roots.push(node) // 孤児対策（親が見つからない場合は根として扱う）
    }
  }
  return roots
}

export const getFolderTree = async (): Promise<TreeNodeData[]> => {
  const allFolders = await db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
  const allTerms = await db.select().from(terms).where(isNotNull(terms.folderId))
  return buildFolderTree(allFolders, allTerms)
}
