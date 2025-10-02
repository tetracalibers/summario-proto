import { atom } from "jotai"

type TermId = number

export const initialAtom = atom<Map<string, TermId>>(new Map<string, TermId>()) // サーバーからの元状態

// ---- UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映） ----
const uiValuesAtom = atom<string[]>([])

const uiNameSetAtom = atom<Set<string>>((get) => {
  return new Set(get(uiValuesAtom))
})

// 入力欄 onChange から呼ぶ write-only atom
export const setUiFromInputAtom = atom(null, (_get, set, values: string[]) => {
  set(uiValuesAtom, values)
})

// 追加：UIにあるが initial には無い名前
const toAddNamesAtom = atom<string[]>((get) => {
  const ui = get(uiValuesAtom)
  const init = get(initialAtom)
  return Array.from(ui).filter((name) => !init.has(name))
})

// 削除：initial にはあるが UI には無い → その name に紐づく既存 ID すべて
const toRemoveIdsAtom = atom<TermId[]>((get) => {
  const uiNameSet = get(uiNameSetAtom)
  const init = get(initialAtom)
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
