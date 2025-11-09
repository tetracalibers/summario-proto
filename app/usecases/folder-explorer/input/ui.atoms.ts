import { atomWithReset } from "jotai/utils"
import type { EntryType } from "../types"

export const displayedInputEntryType$ = atomWithReset<EntryType | null>(null)
export const entryInputValue$ = atomWithReset("")
export const entryInputError$ = atomWithReset<string | null>(null)
