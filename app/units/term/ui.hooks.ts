import { useSetAtom } from "jotai"
import { isDirtyContent$ } from "./ui.atoms"

export function useTermContentState() {
  const setIsDirty = useSetAtom(isDirtyContent$)
  return { setIsDirty }
}
