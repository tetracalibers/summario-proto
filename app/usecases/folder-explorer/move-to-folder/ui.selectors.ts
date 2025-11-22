import { atom } from "jotai"
import { destinationFolderId$ } from "./ui.atoms"

export const isMovingMode$ = atom((get) => {
  return get(destinationFolderId$) !== null
})
