import { atom, type Atom, type Getter } from "jotai"

type TermTitle = string
type TermId = number
export type Term = { id: TermId; title: TermTitle }

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

// タイトル配列をTermオブジェクト配列へ変換するヘルパー
const mapTitlesToTermsAtom = <T extends string, Id extends number>(
  titlesAtom: Atom<Iterable<T>>,
  optionsAtom: Atom<Map<T, Id>>
) => {
  return atom<Term[]>((get) => {
    const titles = get(titlesAtom)
    const options = get(optionsAtom)
    const terms: Term[] = []
    for (const name of titles) {
      const id = options.get(name)
      if (id !== undefined) terms.push({ id, title: name })
    }
    return terms
  })
}

export const initialAtom = atom<Map<TermTitle, TermId>>(new Map<TermTitle, TermId>()) // サーバーからの元状態
export const optionsAtom = atom<Map<TermTitle, TermId>>(new Map<TermTitle, TermId>()) // サーバーからの候補一覧

// UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映）
export const uiAtom = atom<TermTitle[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

// 入力欄の値をTermオブジェクトに変換
export const relatedTermsAtom = mapTitlesToTermsAtom<TermTitle, TermId>(uiAtom, optionsAtom)

// 追加：UIにあるが initial には無い
const toAddTitlesAtom = createDiffTitlesAtom<TermTitle>(
  (get) => get(uiSetAtom),
  (get) => get(initialAtom).keys()
)
const toAddAtom = mapTitlesToTermsAtom<TermTitle, TermId>(toAddTitlesAtom, optionsAtom)

// 削除：initial にはあるが UI には無い
const toRemoveTitlesAtom = createDiffTitlesAtom<TermTitle>(
  (get) => get(initialAtom).keys(),
  (get) => get(uiSetAtom)
)
const toRemoveAtom = mapTitlesToTermsAtom<TermTitle, TermId>(toRemoveTitlesAtom, optionsAtom)

// Save活性（差分があるか）
export const dirtyRelatedAtom = atom((get) => {
  return get(toAddAtom).length > 0 || get(toRemoveAtom).length > 0
})

// 保存ペイロード（差分）
export const relatedSavePayloadAtom = atom((get) => ({
  add: get(toAddAtom),
  remove: get(toRemoveAtom)
}))

export const resetRelatedDiffAtom = atom(null, (get, set, created: Term[], removed: Term[]) => {
  // initial に created を追加、removed を削除
  const init = new Map(get(initialAtom))
  created.forEach((item) => init.set(item.title, item.id))
  removed.forEach((item) => init.delete(item.title))

  set(initialAtom, init)
  set(uiAtom, Array.from(init.keys())) // UIも同期
})
