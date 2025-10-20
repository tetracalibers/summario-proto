import { useAtomValue, useSetAtom } from "jotai"
import { isDirtyContent$ } from "~/aggregates/term/ui.atoms"
import { applyServerAliasSnapshot$, applyServerRelatedTermSnapshot$ } from "./ui.actions"
import { isSaving$ } from "./ui.atoms"
import { isCanSave$, termMetaDiff$ } from "./ui.selectors"

export function useTermContentSaveUi() {
  const setIsSaving = useSetAtom(isSaving$)
  const isCanSave = useAtomValue(isCanSave$)
  const isDirtyEditor = useAtomValue(isDirtyContent$)
  const termMetaDiff = useAtomValue(termMetaDiff$)

  const applyServerAliasSnapshot = useSetAtom(applyServerAliasSnapshot$)
  const applyServerRelatedTermSnapshot = useSetAtom(applyServerRelatedTermSnapshot$)

  return {
    termMetaDiff,
    isCanSave,
    isDirtyEditor,
    setIsSaving,
    applyServerAliasSnapshot,
    applyServerRelatedTermSnapshot
  }
}

export const useTermContentsSavingState = () => {
  const isSaving = useAtomValue(isSaving$)
  return { isSaving }
}
