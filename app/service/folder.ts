import type { TreeNodeData } from "@mantine/core"
import { selectAllFolders, selectAllTerms } from "~/db/query"
import type { Folder, Term } from "~/db/schema"

const rawDataToUIData = (folder: Folder): TreeNodeData => ({
  value: folder.id.toString(),
  label: folder.name,
  children: []
})

const buildFolderTree = (folders: Folder[], terms: Term[]): TreeNodeData[] => {
  const byId = new Map<number, TreeNodeData>()
  const roots: TreeNodeData[] = []

  for (const f of folders) byId.set(f.id, rawDataToUIData(f))
  for (const t of terms) {
    const parent = byId.get(t.folderId!)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push({
        value: `${t.id}`,
        label: t.title,
        children: []
      })
    }
  }

  for (const f of folders) {
    const node = byId.get(f.id)!
    if (f.parentId == null) {
      roots.push(node)
    } else {
      const parent = byId.get(f.parentId)
      if (parent) parent.children?.push(node)
      else roots.push(node) // 孤児対策（親が見つからない場合は根として扱う）
    }
  }
  return roots
}

export const getFolderTree = async (): Promise<TreeNodeData[]> => {
  const [allFolders, allTerms] = await Promise.all([selectAllFolders(), selectAllTerms()])
  return buildFolderTree(allFolders, allTerms)
}
