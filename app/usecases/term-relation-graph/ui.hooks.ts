import type { TermNode } from "./types"
import { centerNode$ } from "./ui.atoms"
import { useAtomValue } from "jotai"
import { edges$, nodes$ } from "./ui.selectors"
import { useSyncAtom } from "~/libs/jotai-utils/hooks"

export const useRelatedGraphUi = (initialCenterNode: TermNode) => {
  useSyncAtom(centerNode$, initialCenterNode)

  const nodes = useAtomValue(nodes$)
  const edges = useAtomValue(edges$)

  return { nodes, edges }
}
