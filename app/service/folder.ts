import {
  queryFolderPath,
  selectChildrenFiles,
  selectChildrenFolders,
  selectFolderById
} from "~/db/query"
import type { Term } from "~/db/schema"

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
