import { atom } from "jotai"
import { RESET } from "jotai/utils"
import { displayedInputEntryType$, entryInputValue$ } from "./ui.atoms"

export const resetEntryInput$ = atom(null, (_get, set) => {
  set(displayedInputEntryType$, RESET)
  set(entryInputValue$, RESET)
})
