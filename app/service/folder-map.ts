import { type Edge, type Node } from "@xyflow/react"
import { selectAllFolders, selectAllTerms } from "~/db/query"

const TMP_POSITION = { x: 0, y: 0 }

export const getFolderGraph = async (): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const [allFolders, allTerms] = await Promise.all([selectAllFolders(), selectAllTerms()])

  const folderNodes = allFolders.map((folder) => ({
    id: `folder-${folder.id}`,
    data: { label: folder.name },
    position: TMP_POSITION,
    type: "folder",
    deletable: false
  }))
  const termNodes = allTerms.map((term) => ({
    id: `term-${term.id}`,
    data: { label: term.title },
    position: TMP_POSITION,
    type: "file",
    deletable: false
  }))

  // フォルダとフォルダ、フォルダと用語の関係をエッジとして追加
  const edges = []
  for (const folder of allFolders) {
    if (folder.parentId) {
      edges.push({
        id: `folder-${folder.parentId}--folder-${folder.id}`,
        source: `folder-${folder.parentId}`,
        target: `folder-${folder.id}`
      })
    }
  }
  for (const term of allTerms) {
    if (term.folderId) {
      edges.push({
        id: `folder-${term.folderId}--term-${term.id}`,
        source: `folder-${term.folderId}`,
        target: `term-${term.id}`
      })
    }
  }

  return { nodes: [...folderNodes, ...termNodes], edges }
}
