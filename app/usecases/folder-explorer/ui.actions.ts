import { atom, useAtomValue, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { displayedInputEntryType$, entryInputValue$ } from "./ui.atoms"
import { isActiveFileInput$, isActiveFolderInput$ } from "./ui.selectors"

const resetEntryInput$ = atom(null, (_get, set) => {
  set(displayedInputEntryType$, RESET)
  set(entryInputValue$, RESET)
})

export const useFolderExplorerInputUi = () => {
  const showEntryInput = useSetAtom(displayedInputEntryType$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const isActiveFileInput = useAtomValue(isActiveFileInput$)
  const isActiveFolderInput = useAtomValue(isActiveFolderInput$)

  return { showEntryInput, resetAndHideEntryInput, isActiveFileInput, isActiveFolderInput }
}
