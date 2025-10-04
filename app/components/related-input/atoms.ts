import { atom } from "jotai"

type TermId = number
export type Term = { id: TermId; title: string }

export const initialAtom = atom<Set<string>>(new Set<string>()) // サーバーからの元状態
export const optionsAtom = atom<Map<string, TermId>>(new Map<string, TermId>()) // サーバーからの候補一覧

// ---- UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映） ----
export const uiAtom = atom<string[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

// 入力欄の値をTermオブジェクトに変換するための atom
export const relatedNodesAtom = atom((get) => {
  const ui = get(uiSetAtom)
  const opts = get(optionsAtom)
  return Array.from(ui).map((name) => ({ id: opts.get(name)!, title: name }))
})

// 追加：UIにあるが initial には無い名前
const toAddIdsAtom = atom<string[]>((get) => {
  const ui = get(uiSetAtom)
  const init = get(initialAtom)
  return Array.from(ui).filter((name) => !init.has(name))
})

// 削除：initial にはあるが UI には無い → その name に紐づく既存 ID すべて
const toRemoveIdsAtom = atom<string[]>((get) => {
  const ui = get(uiSetAtom)
  const init = get(initialAtom)
  return Array.from(init).filter((name) => !ui.has(name))
})

// Save活性（差分があるか）
export const dirtyRelatedAtom = atom((get) => {
  return get(toAddIdsAtom).length > 0 || get(toRemoveIdsAtom).length > 0
})

// 保存ペイロード（差分）
export const relatedSavePayloadAtom = atom((get) => ({
  add: Array.from(get(toAddIdsAtom)), // TermId[]
  remove: Array.from(get(toRemoveIdsAtom)) // TermId[]
}))
