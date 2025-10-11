import type { JSONContent } from "@tiptap/react"
import { type Edge, type Node } from "@xyflow/react"
import {
  createEdgeId,
  createFileNodeId,
  createFolderNodeId
} from "~/components/folder-map/node-edge-id"
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
      id: createFolderNodeId(folder.id),
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
      id: createFileNodeId(term.id),
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
      const sourceId = createFolderNodeId(folder.parentId)
      const targetId = createFolderNodeId(folder.id)
      edges.push({
        id: createEdgeId(sourceId, targetId),
        source: sourceId,
        target: targetId
      })
    }
  }
  for (const term of terms) {
    if (term.folderId) {
      const sourceId = createFolderNodeId(term.folderId)
      const targetId = createFileNodeId(term.id)
      edges.push({
        id: createEdgeId(sourceId, targetId),
        source: sourceId,
        target: targetId
      })
    }
  }

  return { nodes: [...folderNodes, ...termNodes], edges }
}
