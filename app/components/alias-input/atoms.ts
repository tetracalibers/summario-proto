import { atom, type Atom, type Getter } from "jotai"

type AliasTitle = string
type AliasId = number
export type Alias = { id: AliasId; title: AliasTitle }

// タイトル集合の差分だけを返すヘルパー
const createDiffTitlesAtom = <T extends string>(
  getLeft: (get: Getter) => Iterable<T>,
  getRight: (get: Getter) => Iterable<T>
) => {
  return atom<T[]>((get) => {
    const left = new Set(getLeft(get))
    const right = new Set(getRight(get))
    return [...left].filter((name) => !right.has(name))
  })
}

// タイトル配列を ID 配列へ変換するヘルパー
const mapTitlesToIdsAtom = <T extends string, Id>(
  titlesAtom: Atom<Iterable<T>>,
  optionsAtom: Atom<Map<T, Id>>
) => {
  return atom<Id[]>((get) => {
    const titles = get(titlesAtom)
    const options = get(optionsAtom)
    const ids: Id[] = []
    for (const name of titles) {
      const id = options.get(name)
      if (id !== undefined) ids.push(id)
    }
    return ids
  })
}

export const initialAtom = atom<Map<AliasTitle, AliasId>>(new Map<AliasTitle, AliasId>()) // サーバーからの元状態

// UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映）
export const uiAtom = atom<AliasTitle[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

// 追加：UIにあるが initial には無い
const toAddTitlesAtom = createDiffTitlesAtom(
  (get) => get(uiAtom),
  (get) => get(initialAtom).keys()
)

// 削除：initial にはあるが UI には無い
const toRemoveTitlesAtom = createDiffTitlesAtom(
  (get) => get(initialAtom).keys(),
  (get) => get(uiSetAtom)
)
// その title に紐づく id すべて
const toRemoveIdsAtom = mapTitlesToIdsAtom(toRemoveTitlesAtom, initialAtom)

// Save活性（差分があるか）
export const dirtyAliasAtom = atom((get) => {
  return get(toAddTitlesAtom).length > 0 || get(toRemoveIdsAtom).length > 0
})

// 保存ペイロード（差分）
export const aliasSavePayloadAtom = atom((get) => ({
  add: Array.from(get(toAddTitlesAtom)),
  remove: Array.from(get(toRemoveIdsAtom))
}))

export const resetAliasDiffAtom = atom(null, (get, set, created: Alias[], removed: Alias[]) => {
  // initial に created を追加、removed を削除
  const init = new Map(get(initialAtom))
  created.forEach((item) => init.set(item.title, item.id))
  removed.forEach((item) => init.delete(item.title))

  set(initialAtom, init)
  set(uiAtom, Array.from(init.keys())) // UIも同期
})
