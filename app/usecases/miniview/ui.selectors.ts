import { atom } from "jotai"
import { miniviewTermId$, pageTermId$ } from "./ui.atoms"
import { currentRelatedTerms$ } from "~/units/related-term/ui.selectors"

export const isVisibleMiniview$ = atom((get) => {
  const miniviewTermId = get(miniviewTermId$)
  if (miniviewTermId === null) return false

  const currentPageTermId = get(pageTermId$)
  const currentRelatedTerms = get(currentRelatedTerms$)
  const relatedTermIds = new Set([...currentRelatedTerms.map((n) => n.id), currentPageTermId])

  // MiniView表示中の用語が関連用語から削除されたらMiniViewも削除
  return relatedTermIds.has(miniviewTermId)
})
