import { useAtomValue, useSetAtom } from "jotai"
import { isDirtyContent$, termTitle$ } from "./ui.atoms"
import { useSyncAtom } from "~/libs/jotai-utils/hooks"

export function useTermContentState() {
  const setIsDirty = useSetAtom(isDirtyContent$)
  return { setIsDirty }
}

export const useSyncTermTitle = (initial: string) => {
  useSyncAtom(termTitle$, initial)

  const setTermTitle = useSetAtom(termTitle$)
  return { setTermTitle }
}

export const useTermTitleState = () => {
  const termTitle = useAtomValue(termTitle$)
  return { termTitle }
}
