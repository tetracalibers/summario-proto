import { atom } from "jotai"
import { displayedInputEntryType$ } from "./ui.atoms"
import { folderId$ } from "../ui.atoms"

export const isActiveFileInput$ = atom((get) => {
  const displayedType = get(displayedInputEntryType$)
  return displayedType === "file"
})

export const isActiveFolderInput$ = atom((get) => {
  const displayedType = get(displayedInputEntryType$)
  return displayedType === "folder"
})

export const folderIdforDB$ = atom((get) => {
  const folderId = get(folderId$)
  return folderId === "root" ? null : folderId
})
