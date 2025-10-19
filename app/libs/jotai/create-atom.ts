import { atom, type Atom, type Getter } from "jotai"

// 差分だけを返す
export const $createDiff = <T extends string>(
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

// 配列をオブジェクト配列へ変換するヘルパー
export const $mapLabelsToItems = <Label extends string, Id extends number>(
  debugLabel: string,
  labelsAtom: Atom<Iterable<Label>>,
  mapAtom: Atom<Map<Label, Id>>
) => {
  const atom$ = atom((get) => {
    const labels = get(labelsAtom)
    const map = get(mapAtom)
    const items = []
    for (const label of labels) {
      const id = map.get(label)
      if (id !== undefined) items.push({ id, title: label })
    }
    return items
  })
  atom$.debugLabel = debugLabel
  return atom$
}
