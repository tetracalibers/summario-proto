import { atom } from "jotai"
import { destinationFolderId$ } from "./move-to-folder/ui.atoms"

export const isSelectionMode$ = atom((get) => {
  return get(destinationFolderId$) !== null
})
