import { atom } from "jotai"

type TermTitle = string
type TermId = number
export type Term = { id: TermId; title: TermTitle }

export const initialAtom = atom<Map<TermTitle, TermId>>(new Map<TermTitle, TermId>()) // サーバーからの元状態
export const optionsAtom = atom<Map<TermTitle, TermId>>(new Map<TermTitle, TermId>()) // サーバーからの候補一覧

// ---- UIが現在表示しているタグ（入力欄の onChange(values) をそのまま反映） ----
export const uiAtom = atom<TermTitle[]>([])
const uiSetAtom = atom((get) => new Set(get(uiAtom)))

//

// 入力欄の値をTermオブジェクトに変換するための atom
export const relatedNodesAtom = atom((get) => {
  const ui = get(uiAtom)
  const options = get(optionsAtom)
  return ui
    .map((name) => {
      const id = options.get(name)
      if (!id) return null
      return { id, title: name }
    })
    .filter((v): v is Term => v !== null)
})

// 追加：UIにあるが initial には無い名前
const toAddIdsAtom = atom<TermId[]>((get) => {
  const ui = get(uiSetAtom)
  const init = get(initialAtom)
  return Array.from(ui)
    .filter((name) => !init.has(name))
    .map((name) => get(optionsAtom).get(name)!)
})

// 削除：initial にはあるが UI には無い → その name に紐づく既存 ID すべて
const toRemoveIdsAtom = atom<TermId[]>((get) => {
  const ui = get(uiSetAtom)
  const init = get(initialAtom)
  return Array.from(init)
    .filter(([name, _]) => !ui.has(name))
    .map(([_, id]) => id)
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

export const resetRelatedDiffAtom = atom(
  null,
  (get, set, created: { title: TermTitle; id: TermId }[], removed: { title: TermTitle }[]) => {
    // initial に created を追加、removed を削除
    const init = new Map(get(initialAtom))
    created.forEach((item) => init.set(item.title, item.id))
    removed.forEach((item) => init.delete(item.title))

    set(initialAtom, init)
    set(uiAtom, Array.from(init.keys())) // UIも同期
  }
)
