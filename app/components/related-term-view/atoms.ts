import { atom } from "jotai"
import { currentRelatedTerms$ } from "~/domains/related-term/ui.selectors"

export type Node = { id: number; title: string }
export type Edge = { source: number; target: number }

export const centerNodeAtom = atom<Node>()

export const nodesAtom = atom<Node[]>((get) => {
  const centerNode = get(centerNodeAtom)
  if (!centerNode) return []
  const relatedNodes = get(currentRelatedTerms$)
  return [centerNode, ...relatedNodes]
})

export const edgesAtom = atom<Edge[]>((get) => {
  const centerNode = get(centerNodeAtom)
  if (!centerNode) return []
  const relatedNodes = get(currentRelatedTerms$)
  return relatedNodes.map((node) => ({ source: centerNode.id, target: node.id }))
})

const nodeIdsAtom = atom<Set<number>>((get) => {
  return new Set(get(nodesAtom).map((n) => n.id))
})

export const miniviewNodeIdAtom = atom<number | null>(null)

export const existsMiniviewAtomInNodes = atom((get) => {
  const miniviewNodeId = get(miniviewNodeIdAtom)
  if (miniviewNodeId === null) return false
  const nodeIds = get(nodeIdsAtom)
  return nodeIds.has(miniviewNodeId)
})
