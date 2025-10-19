import { $createDiff, $mapLabelsToItems } from "~/libs/jotai/create-atom"
import { optionsRelatedTerm$, serverRelatedTerm$, uiRelatedTermLabel$ } from "./ui.atoms"
import { atom } from "jotai"

// 追加：UIにあるが serverData には無い
const toAddRelatedTermLabels$ = $createDiff(
  "toAddRelatedTermLabels",
  (get) => get(uiRelatedTermLabel$),
  (get) => get(serverRelatedTerm$).keys()
)
const toAddRelatedTerm$ = $mapLabelsToItems(
  "toAddRelatedTerm",
  toAddRelatedTermLabels$,
  optionsRelatedTerm$
)

// 削除：serverData にはあるが UI には無い
const toRemoveRelatedTermLabels$ = $createDiff(
  "toRemoveRelatedTermLabels",
  (get) => get(serverRelatedTerm$).keys(),
  (get) => get(uiRelatedTermLabel$)
)
const toRemoveRelatedTerm$ = $mapLabelsToItems(
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

export const currentRelatedTerms$ = $mapLabelsToItems(
  "currentRelatedTerms",
  uiRelatedTermLabel$,
  optionsRelatedTerm$
)
