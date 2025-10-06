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

// タイトル配列をAliasオブジェクト配列へ変換するヘルパー
const mapTitlesToAliasesAtom = <T extends string, Id extends number>(
  titlesAtom: Atom<Iterable<T>>,
  optionsAtom: Atom<Map<T, Id>>
) => {
  return atom<Alias[]>((get) => {
    const titles = get(titlesAtom)
    const options = get(optionsAtom)
    const aliases: Alias[] = []
    for (const name of titles) {
      const id = options.get(name)
      if (id !== undefined) aliases.push({ id, title: name })
    }
    return aliases
  })
}

export const serverDataAtom = atom<Map<AliasTitle, AliasId>>(new Map<AliasTitle, AliasId>()) // サーバーからの元状態

// UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映）
export const uiAtom = atom<AliasTitle[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

// 追加：UIにあるが serverData には無い
const toAddTitlesAtom = createDiffTitlesAtom(
  (get) => get(uiAtom),
  (get) => get(serverDataAtom).keys()
)
const toAddAtom = atom<{ title: AliasTitle }[]>((get) => {
  return get(toAddTitlesAtom).map((title) => ({ title }))
})

// 削除：serverData にはあるが UI には無い
const toRemoveTitlesAtom = createDiffTitlesAtom(
  (get) => get(serverDataAtom).keys(),
  (get) => get(uiSetAtom)
)
const toRemoveAtom = mapTitlesToAliasesAtom(toRemoveTitlesAtom, serverDataAtom)

// Save活性（差分があるか）
export const dirtyAliasAtom = atom((get) => {
  return get(toAddAtom).length > 0 || get(toRemoveAtom).length > 0
})

// 保存ペイロード（差分）
export const aliasSavePayloadAtom = atom((get) => ({
  add: get(toAddAtom),
  remove: get(toRemoveAtom)
}))

export const resetAliasDiffAtom = atom(null, (get, set, created: Alias[], removed: Alias[]) => {
  // serverData に created を追加、removed を削除
  const data = new Map(get(serverDataAtom))
  created.forEach((item) => data.set(item.title, item.id))
  removed.forEach((item) => data.delete(item.title))

  set(serverDataAtom, data)
  set(uiAtom, Array.from(data.keys())) // UIも同期
})
