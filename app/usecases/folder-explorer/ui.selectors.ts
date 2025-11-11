import { atom } from "jotai"
import { folderId$ } from "./ui.atoms"

export const folderIdforDB$ = atom((get) => {
  const folderId = get(folderId$)
  return folderId === "root" ? null : folderId
})
