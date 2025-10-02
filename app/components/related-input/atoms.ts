import { atom } from "jotai"

type TermId = number
type Term = { id: TermId; title: string }

export const initialAtom = atom<Term[]>([]) // サーバーからの元状態
export const optionsAtom = atom<Term[]>([]) // サーバーからの候補一覧

const initialMapAtom = atom<Map<string, TermId>>((get) => {
  return new Map(get(initialAtom).map((a) => [a.title, a.id]))
})
const optionsMapAtom = atom<Map<string, TermId>>((get) => {
  return new Map(get(optionsAtom).map((a) => [a.title, a.id]))
})

// ---- UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映） ----
const uiValuesAtom = atom<string[]>([])

const uiNameSetAtom = atom<Set<string>>((get) => {
  return new Set(get(uiValuesAtom))
})

// 入力欄 onChange から呼ぶ write-only atom
export const setUiFromInputAtom = atom(null, (_get, set, values: string[]) => {
  set(uiValuesAtom, values)
})

// 入力欄の値をTermオブジェクトに変換するための atom
export const relatedNodesAtom = atom((get) => {
  const ui = get(uiValuesAtom)
  const opts = get(optionsMapAtom)
  return ui.map((name) => ({ id: opts.get(name)!, title: name }))
})

// 追加：UIにあるが initial には無い名前
const toAddNamesAtom = atom<string[]>((get) => {
  const ui = get(uiValuesAtom)
  const init = get(initialMapAtom)
  return Array.from(ui).filter((name) => !init.has(name))
})

// 削除：initial にはあるが UI には無い → その name に紐づく既存 ID すべて
const toRemoveIdsAtom = atom<TermId[]>((get) => {
  const uiNameSet = get(uiNameSetAtom)
  const init = get(initialMapAtom)
  return Array.from(init)
    .filter(([name]) => !uiNameSet.has(name))
    .map(([, id]) => id)
})

// Save活性（差分があるか）
export const dirtyRelatedAtom = atom((get) => {
  return get(toAddNamesAtom).length > 0 || get(toRemoveIdsAtom).length > 0
})

// 保存ペイロード（差分）
export const savePayloadAtom = atom((get) => ({
  add: Array.from(get(toAddNamesAtom)), // string[]
  remove: Array.from(get(toRemoveIdsAtom)) // TermId[]
}))
