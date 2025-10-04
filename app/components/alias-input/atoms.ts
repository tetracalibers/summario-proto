import { atom } from "jotai"

export type AliasId = number
export type Alias = { id: AliasId; title: string }

export const initialAtom = atom<Map<string, AliasId>>(new Map<string, AliasId>()) // サーバーからの元状態

// ---- UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映） ----
export const uiAtom = atom<string[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

// 追加：UIにあるが initial には無い名前
const toAddNamesAtom = atom<string[]>((get) => {
  const ui = get(uiAtom)
  const init = get(initialAtom)
  return Array.from(ui).filter((name) => !init.has(name))
})

// 削除：initial にはあるが UI には無い → その name に紐づく既存 ID すべて
const toRemoveIdsAtom = atom<AliasId[]>((get) => {
  const ui = get(uiSetAtom)
  const init = get(initialAtom)
  return Array.from(init)
    .filter(([name]) => !ui.has(name))
    .map(([, id]) => id)
})

// Save活性（差分があるか）
export const dirtyAliasAtom = atom((get) => {
  return get(toAddNamesAtom).length > 0 || get(toRemoveIdsAtom).length > 0
})

// 保存ペイロード（差分）
export const aliasSavePayloadAtom = atom((get) => ({
  add: Array.from(get(toAddNamesAtom)), // string[]
  remove: Array.from(get(toRemoveIdsAtom)) // AliasId[]
}))
