import * as FolderService from "~/units/folder/service.server"
import * as FolderChildrenReadStore from "../folder-detail/readstore.server"

export const getFolder = async (folderId: number | null) => {
  if (folderId === null) return null
  return FolderService.getFolder(folderId)
}

export const getFolderPath = async (folderId: number | null) => {
  if (folderId === null) return null
  return FolderService.getFolderPath(folderId)
}

export const getFolderChildren = async (folderId: number | null) => {
  const [folders, files] = await Promise.all([
    FolderChildrenReadStore.findChildrenFolders(folderId),
    FolderChildrenReadStore.findChildrenFiles(folderId)
  ])
  return { folders, files }
}
