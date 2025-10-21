import { useSyncAtom } from "~/libs/jotai-utils/hooks"
import { termTitle$ } from "./ui.atoms"
import { useAtomValue, useSetAtom } from "jotai"

export const useSyncTermTitle = (initial: string) => {
  useSyncAtom(termTitle$, initial)

  const setTermTitle = useSetAtom(termTitle$)
  return { setTermTitle }
}

export const useReadTermTitle = () => {
  const termTitle = useAtomValue(termTitle$)
  return { termTitle }
}
