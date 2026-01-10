import { atom } from "jotai"
import { destFolder$, filesToMove$, foldersToMove$ } from "./ui.atoms"
import { RESET } from "jotai/utils"

export const updateFileIdsToMove$ = atom(null, (get, set, file: { id: number; name: string }) => {
  const files = new Map(get(filesToMove$))
  if (files.has(file.id)) {
    files.delete(file.id)
  } else {
    files.set(file.id, file.name)
  }
  set(filesToMove$, files)
})

export const updateFolderIdsToMove$ = atom(
  null,
  (get, set, folder: { id: number; name: string }) => {
    const folders = new Map(get(foldersToMove$))
    if (folders.has(folder.id)) {
      folders.delete(folder.id)
    } else {
      folders.set(folder.id, folder.name)
    }
    set(foldersToMove$, folders)
  }
)

export const resetMovingModeState$ = atom(null, (_, set) => {
  set(filesToMove$, RESET)
  set(foldersToMove$, RESET)
  set(destFolder$, RESET)
})
