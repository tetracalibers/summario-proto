import { deriveDiffAtom, deriveItemsAtomFromLabels } from "~/libs/jotai-utils/derive-atom"
import { optionsRelatedTerm$, serverRelatedTerm$, uiRelatedTermLabel$ } from "./ui.atoms"
import { atom } from "jotai"

// 追加：UIにあるが serverData には無い
const toAddRelatedTermLabels$ = deriveDiffAtom(
  "toAddRelatedTermLabels",
  (get) => get(uiRelatedTermLabel$),
  (get) => get(serverRelatedTerm$).keys()
)
const toAddRelatedTerm$ = deriveItemsAtomFromLabels(
  "toAddRelatedTerm",
  toAddRelatedTermLabels$,
  optionsRelatedTerm$
)

// 削除：serverData にはあるが UI には無い
const toRemoveRelatedTermLabels$ = deriveDiffAtom(
  "toRemoveRelatedTermLabels",
  (get) => get(serverRelatedTerm$).keys(),
  (get) => get(uiRelatedTermLabel$)
)
const toRemoveRelatedTerm$ = deriveItemsAtomFromLabels(
  "toRemoveRelatedTerm",
  toRemoveRelatedTermLabels$,
  optionsRelatedTerm$
)

// Save活性（差分があるか）
export const isDirtyRelatedTerm$ = atom((get) => {
  return get(toAddRelatedTerm$).length > 0 || get(toRemoveRelatedTerm$).length > 0
})

// 保存ペイロード（差分）
export const relatedTermDiff$ = atom((get) => ({
  add: get(toAddRelatedTerm$),
  remove: get(toRemoveRelatedTerm$)
}))

export const currentRelatedTerms$ = deriveItemsAtomFromLabels(
  "currentRelatedTerms",
  uiRelatedTermLabel$,
  optionsRelatedTerm$
)
