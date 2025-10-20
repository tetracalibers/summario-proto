import { atomWithReset } from "jotai/utils"
import type { EntryType } from "./types"
import { atom } from "jotai"

export const folderId$ = atom<number | "root" | null>(null)

export const displayedInputEntryType$ = atomWithReset<EntryType | null>(null)
export const entryInputValue$ = atomWithReset("")
