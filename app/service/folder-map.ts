import type { JSONContent } from "@tiptap/react"
import { type Edge, type Node } from "@xyflow/react"
import { selectAllFolders, selectAllTerms } from "~/db/query"

const TMP_POSITION = { x: 0, y: 0 }

const judgeContentEmpty = (json: JSONContent) => {
  if (!json.content) return true
  if (json.content.length === 0) return true

  if (json.content.length === 1) {
    const firstNode = json.content[0]
    if (!firstNode.content) return true

    const children = firstNode.content
    if (children.length === 0) return true

    if (firstNode.type === "title_block") return true
  }

  return false
}

export const getFolderGraph = async (): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const [folders, terms] = await Promise.all([selectAllFolders(), selectAllTerms()])

  const hasChildrenFolderIds = new Set([
    ...folders.filter((folder) => folder.parentId !== null).map((folder) => folder.parentId!),
    ...terms.filter((term) => term.folderId !== null).map((term) => term.folderId!)
  ])

  const folderNodes = folders.map((folder) => {
    const hasChildren = hasChildrenFolderIds.has(folder.id)
    return {
      id: `folder-${folder.id}`,
      data: {
        label: folder.name,
        tmp: false
      },
      position: TMP_POSITION,
      type: "folder",
      deletable: !hasChildren
    }
  })
  const termNodes = terms.map((term) => {
    const isContentEmpty = judgeContentEmpty(term.content as JSONContent)
    return {
      id: `term-${term.id}`,
      data: {
        label: term.title,
        isContentEmpty,
        tmp: false
      },
      position: TMP_POSITION,
      type: "file",
      deletable: isContentEmpty
    }
  })

  // フォルダとフォルダ、フォルダと用語の関係をエッジとして追加
  const edges: Edge[] = []
  for (const folder of folders) {
    if (folder.parentId) {
      edges.push({
        id: `folder-${folder.parentId}--folder-${folder.id}`,
        source: `folder-${folder.parentId}`,
        target: `folder-${folder.id}`
      })
    }
  }
  for (const term of terms) {
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
