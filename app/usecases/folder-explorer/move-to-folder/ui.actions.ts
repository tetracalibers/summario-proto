import { atom } from "jotai"
import { destFolder$, fileIdsToMove$, folderIdsToMove$ } from "./ui.atoms"
import { RESET } from "jotai/utils"

export const updateFileIdsToMove$ = atom(null, (get, set, fileId: number) => {
  const fileIds = new Set(get(fileIdsToMove$))
  if (fileIds.has(fileId)) {
    fileIds.delete(fileId)
  } else {
    fileIds.add(fileId)
  }
  set(fileIdsToMove$, fileIds)
})

export const updateFolderIdsToMove$ = atom(null, (get, set, folderId: number) => {
  const folderIds = new Set(get(folderIdsToMove$))
  if (folderIds.has(folderId)) {
    folderIds.delete(folderId)
  } else {
    folderIds.add(folderId)
  }
  set(folderIdsToMove$, folderIds)
})

export const resetMovingModeState$ = atom(null, (_, set) => {
  set(fileIdsToMove$, RESET)
  set(folderIdsToMove$, RESET)
  set(destFolder$, RESET)
})
