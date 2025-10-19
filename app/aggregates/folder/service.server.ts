import * as FolderRepository from "./repository.server"

export const getFolder = async (folderId: number) => {
  const [folder] = await FolderRepository.findById(folderId)
  return folder
}

export const getFolderPath = async (folderId: number) => {
  return FolderRepository.findPath(folderId)
}
