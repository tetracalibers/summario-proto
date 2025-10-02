import { atom } from "jotai"
import { relatedNodesAtom } from "../related-input/atoms"

export type Node = { id: number; title: string }
export type Edge = { source: number; target: number }

export const centerNodeAtom = atom<Node>()

export const nodesAtom = atom<Node[]>((get) => {
  const centerNode = get(centerNodeAtom)
  if (!centerNode) return []
  const relatedNodes = get(relatedNodesAtom)
  return [centerNode, ...relatedNodes]
})

export const edgesAtom = atom<Edge[]>((get) => {
  const centerNode = get(centerNodeAtom)
  if (!centerNode) return []
  const relatedNodes = get(relatedNodesAtom)
  return relatedNodes.map((node) => ({ source: centerNode.id, target: node.id }))
})
