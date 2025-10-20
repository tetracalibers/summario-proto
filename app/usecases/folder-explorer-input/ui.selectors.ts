import { atom } from "jotai"
import { displayedInputEntryType$ } from "./ui.atoms"

export const isActiveFileInput$ = atom((get) => {
  const displayedType = get(displayedInputEntryType$)
  return displayedType === "file"
})

export const isActiveFolderInput$ = atom((get) => {
  const displayedType = get(displayedInputEntryType$)
  return displayedType === "folder"
})
