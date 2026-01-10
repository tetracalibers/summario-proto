import { atom } from "jotai"
import { destFolder$, fileIdsToMove$, folderIdsToMove$ } from "./ui.atoms"

export const isMovingMode$ = atom((get) => {
  return get(destFolder$) !== null
})

export const selectedCount$ = atom((get) => {
  const fileIdsToMove = get(fileIdsToMove$)
  const folderIdsToMove = get(folderIdsToMove$)
  return fileIdsToMove.size + folderIdsToMove.size
})
