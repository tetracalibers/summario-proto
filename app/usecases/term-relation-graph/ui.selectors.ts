import { atom } from "jotai"
import type { Edge, TermNode } from "./types"
import { centerNode$ } from "./ui.atoms"
import { currentRelatedTerms$ } from "~/units/related-term/ui.selectors"

export const nodes$ = atom<TermNode[]>((get) => {
  return get(currentRelatedTerms$)
})

export const edges$ = atom<Edge[]>((get) => {
  const centerNode = get(centerNode$)
  if (!centerNode) return []
  const relatedNodes = get(currentRelatedTerms$)
  return relatedNodes.map((node) => ({ source: centerNode.id, target: node.id }))
})
