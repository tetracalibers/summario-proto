import { useEffect } from "react"
import { useSetAtom, type WritableAtom } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

export const useSyncAtom = <T>(atom$: WritableAtom<T, [T], void>, value: T) => {
  // set initial value
  useHydrateAtoms([[atom$, value]])

  // sync on value change
  const setAtom = useSetAtom(atom$)
  useEffect(() => {
    setAtom(value)
  }, [value, setAtom])
}
