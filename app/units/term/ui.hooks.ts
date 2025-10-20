import { useSetAtom } from "jotai"
import { isDirtyContent$ } from "./ui.atoms"

export function useTermContentEditUi() {
  const setIsDirty = useSetAtom(isDirtyContent$)
  return { setIsDirty }
}
