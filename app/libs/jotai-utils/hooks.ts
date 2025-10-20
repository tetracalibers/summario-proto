import { useEffect } from "react"
import { useSetAtom, type WritableAtom } from "jotai"

export const useSyncAtom = <T>(atom$: WritableAtom<T, [T], void>, value: T) => {
  const setAtom = useSetAtom(atom$)
  useEffect(() => {
    setAtom(value)
  }, [setAtom])
}
