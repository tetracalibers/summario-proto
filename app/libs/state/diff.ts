import { atom, type Getter } from "jotai"

// 差分だけを返す
export const createDiffAtom = <T extends string>(
  debugLabel: string,
  getLeft: (get: Getter) => Iterable<T>,
  getRight: (get: Getter) => Iterable<T>
) => {
  const atom$ = atom<T[]>((get) => {
    const left = new Set(getLeft(get))
    const right = new Set(getRight(get))
    return [...left].filter((name) => !right.has(name))
  })
  atom$.debugLabel = debugLabel
  return atom$
}
