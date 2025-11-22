import { atom } from "jotai"

// ref: https://jotai.org/docs/recipes/atom-with-toggle
export const atomWithToggle = (initialValue?: boolean) => {
  const baseAtom = atom(initialValue ?? false)
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set) => {
      const current = get(baseAtom)
      set(baseAtom, !current)
    }
  )
  return derivedAtom
}
