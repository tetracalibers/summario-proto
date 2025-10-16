import { atom } from "jotai"
import { atomWithReset, RESET } from "jotai/utils"

type EntryType = "folder" | "file"

export const displayedEntryInputTypeAtom = atomWithReset<EntryType | null>(null)
export const entryInputValueAtom = atomWithReset("")

export const resetEntryInputAtom = atom(null, (_get, set) => {
  set(displayedEntryInputTypeAtom, RESET)
  set(entryInputValueAtom, RESET)
})
