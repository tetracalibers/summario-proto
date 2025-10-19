import { deriveItemsAtomFromLabels, deriveDiffAtom } from "~/libs/jotai-utils/transforms"
import { serverAlias$, uiAliasLabel$ } from "./ui.atoms"
import { atom } from "jotai"
import type { Alias } from "./types"

// 追加：UIにあるが serverData には無い
const toAddAliasLabels$ = deriveDiffAtom(
  "toAddAliasLabels",
  (get) => get(uiAliasLabel$),
  (get) => get(serverAlias$).keys()
)
const toAddAlias$ = atom<Omit<Alias, "id">[]>((get) => {
  return get(toAddAliasLabels$).map((title) => ({ title }))
})

// 削除：serverData にはあるが UI には無い
const toRemoveAliasLabels$ = deriveDiffAtom(
  "toRemoveAliasLabels",
  (get) => get(serverAlias$).keys(),
  (get) => get(uiAliasLabel$)
)
const toRemoveAlias$ = deriveItemsAtomFromLabels(
  "toRemoveAlias",
  toRemoveAliasLabels$,
  serverAlias$
)

// Save活性（差分があるか）
export const isDirtyAlias$ = atom((get) => {
  return get(toAddAlias$).length > 0 || get(toRemoveAlias$).length > 0
})

// 保存ペイロード（差分）
export const aliasDiff$ = atom((get) => ({
  add: get(toAddAlias$),
  remove: get(toRemoveAlias$)
}))
