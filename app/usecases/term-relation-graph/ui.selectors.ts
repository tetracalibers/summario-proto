import { atom } from "jotai"
import type { Edge, TermNode } from "./types"
import { centerNode$ } from "./ui.atoms"
import { currentRelatedTerms$ } from "~/aggregates/related-term/ui.selectors"

export const nodes$ = atom<TermNode[]>((get) => {
  const centerNode = get(centerNode$)
  if (!centerNode) return []
  const relatedNodes = get(currentRelatedTerms$)
  return [centerNode, ...relatedNodes]
})

export const edges$ = atom<Edge[]>((get) => {
  const centerNode = get(centerNode$)
  if (!centerNode) return []
  const relatedNodes = get(currentRelatedTerms$)
  return relatedNodes.map((node) => ({ source: centerNode.id, target: node.id }))
})
