import { useFetcher } from "react-router"
import MiniView from "../mini-view/MiniView"
import NetworkGraph from "../network-graph/NetworkGraph"
import type { loader } from "~/routes/miniview"
import { useAtomValue, useSetAtom } from "jotai"
import {
  centerNodeAtom,
  edgesAtom,
  existsMiniviewAtomInNodes,
  miniviewNodeIdAtom,
  nodesAtom,
  type Node
} from "./atoms"
import { useEffect } from "react"

interface Props {
  centerNode: Node
}

export default function RelatedTermView({ centerNode }: Props) {
  const fetcher = useFetcher<typeof loader>()

  const nodes = useAtomValue(nodesAtom)
  const edges = useAtomValue(edgesAtom)

  const setCenterNode = useSetAtom(centerNodeAtom)
  useEffect(() => {
    setCenterNode(centerNode)
  }, [centerNode])

  const setMiniviewNodeId = useSetAtom(miniviewNodeIdAtom)
  const existsInNodes = useAtomValue(existsMiniviewAtomInNodes)

  return (
    <>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        centerId={centerNode.id}
        onNodeClick={(nodeId) => {
          fetcher.load(`/miniview/${nodeId}`)
          setMiniviewNodeId(nodeId)
        }}
      />
      {fetcher.data && existsInNodes && <MiniView contentJson={fetcher.data} />}
    </>
  )
}
