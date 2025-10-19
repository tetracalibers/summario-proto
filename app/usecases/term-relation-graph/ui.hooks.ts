import { useHydrateAtoms } from "jotai/utils"
import type { TermNode } from "./types"
import { centerNode$ } from "./ui.atoms"
import { useAtomValue } from "jotai"
import { edges$, nodes$ } from "./ui.selectors"

export const useRelatedGraphUi = (initialCenterNode: TermNode) => {
  useHydrateAtoms([[centerNode$, initialCenterNode]])

  const nodes = useAtomValue(nodes$)
  const edges = useAtomValue(edges$)

  return { nodes, edges }
}
