import { atom } from "jotai"
import { destFolder$, filesToMove$, foldersToMove$ } from "./ui.atoms"

export const isMovingMode$ = atom((get) => {
  return get(destFolder$) !== null
})

export const selectedCount$ = atom((get) => {
  const filesToMove = get(filesToMove$)
  const foldersToMove = get(foldersToMove$)
  return filesToMove.size + foldersToMove.size
})
