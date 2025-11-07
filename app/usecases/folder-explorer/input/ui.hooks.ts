import { useAtomValue, useSetAtom } from "jotai"
import { resetEntryInput$ } from "./ui.actions"
import { displayedInputEntryType$ } from "./ui.atoms"
import { isActiveFileInput$, isActiveFolderInput$ } from "./ui.selectors"

export const useFolderExplorerInputUi = () => {
  const showEntryInput = useSetAtom(displayedInputEntryType$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const isActiveFileInput = useAtomValue(isActiveFileInput$)
  const isActiveFolderInput = useAtomValue(isActiveFolderInput$)

  return { showEntryInput, resetAndHideEntryInput, isActiveFileInput, isActiveFolderInput }
}
