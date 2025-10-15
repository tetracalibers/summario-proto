import type { TreeNodeData } from "@mantine/core"
import {
  queryFolderContents,
  queryFolderPath,
  selectAllFolders,
  selectAllTerms,
  selectChildrenFiles,
  selectChildrenFolders,
  selectFolderById
} from "~/db/query"
import type { Folder, Term } from "~/db/schema"

const rawDataToUIData = (folder: Folder): TreeNodeData => ({
  value: folder.id.toString(),
  label: folder.name,
  children: []
})

const buildFolderTree = (folders: Folder[], terms: Term[]): TreeNodeData[] => {
  const byId = new Map<number, TreeNodeData>()

  // 先に全フォルダのノードを作っておく
  for (const f of folders) byId.set(f.id, rawDataToUIData(f))

  // ルート候補を「親あり」「親なし（孤児）」で分けて保持
  const properRoots: TreeNodeData[] = [] // 親参照が正しいルート
  const orphanRoots: TreeNodeData[] = [] // 親が存在しない（孤児）フォルダ

  // フォルダの親子付け
  for (const f of folders) {
    const node = byId.get(f.id)!
    if (f.parentId == null) {
      properRoots.push(node)
    } else {
      const parent = byId.get(f.parentId)
      if (parent) {
        ;(parent.children ||= []).push(node)
      } else {
        // 親が見つからないフォルダは最後に回す
        orphanRoots.push(node)
      }
    }
  }

  // 用語の親付け。親がない（folderIdなし or 親フォルダ不在）ものは最後に回す
  const rootTerms: TreeNodeData[] = []
  for (const t of terms) {
    const termNode: TreeNodeData = { value: `${t.id}`, label: t.title, children: [] }

    if (!t.folderId) {
      // ルート直下の用語（親なし）→ 最後にまとめて追加
      rootTerms.push(termNode)
      continue
    }

    const parent = byId.get(t.folderId)
    if (parent) {
      ;(parent.children ||= []).push(termNode)
    } else {
      // 親フォルダが存在しない用語（実質的に親なし）
      rootTerms.push(termNode)
    }
  }

  // 並び順：
  // 1) 親が正しく存在するルートフォルダ
  // 2) 親がない用語（folderIdなし or 親不在）
  // 3) 親がないフォルダ（孤児）
  return [...properRoots, ...rootTerms, ...orphanRoots]
}

export const getFolderTree = async (): Promise<TreeNodeData[]> => {
  const [allFolders, allTerms] = await Promise.all([selectAllFolders(), selectAllTerms()])
  return buildFolderTree(allFolders, allTerms)
}

export const sortTermsByNearestFolder = (terms: Term[], folderId: number | null) => {
  // folderId が null の場合、親がない用語が優先されるようにする
  if (!folderId) {
    return terms.sort((a, b) => {
      const aDistance = a.folderId ? 1 : 0
      const bDistance = b.folderId ? 1 : 0
      return aDistance - bDistance
    })
  }

  return terms.sort((a, b) => {
    const aDistance = a.folderId === folderId ? 0 : 1
    const bDistance = b.folderId === folderId ? 0 : 1
    return aDistance - bDistance
  })
}

export const getFolderContents = async (folderId: number | null) => {
  const folders = await selectChildrenFolders(folderId)
  const files = await selectChildrenFiles(folderId)
  return { folders, files }
}

export const getFolder = async (folderId: number | null) => {
  if (folderId === null) return null
  const [folder] = await selectFolderById(folderId)
  return folder
}

export const getFolderPath = async (folderId: number | null) => {
  if (folderId === null) return null
  return queryFolderPath(folderId)
}
