import * as FolderService from "~/aggregates/folder/service.server"

export const getFolder = async (folderId: number | null) => {
  if (folderId === null) return null
  return FolderService.getFolder(folderId)
}

export const getFolderPath = async (folderId: number | null) => {
  if (folderId === null) return null
  return FolderService.getFolderPath(folderId)
}
