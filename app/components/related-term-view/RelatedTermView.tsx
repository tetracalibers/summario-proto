import { useFetcher } from "react-router"
import MiniView from "../mini-view/MiniView"
import NetworkGraph from "../network-graph/NetworkGraph"
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
import type { loader } from "~/routes/api/terms/preview"

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
          fetcher.load(`/api/terms/${nodeId}/preview`)
          setMiniviewNodeId(nodeId)
        }}
      />
      <div
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-default)",
          padding: "0.75rem",
          overflowY: "auto"
        }}
      >
        {fetcher.data && existsInNodes ? (
          <MiniView contentHTML={fetcher.data} />
        ) : (
          <p
            style={{
              display: "grid",
              placeItems: "center",
              height: "100%",
              margin: 0,
              textAlign: "center",
              color: "var(--mantine-color-gray-6)"
            }}
          >
            Clicking a node on the graph...
          </p>
        )}
      </div>
    </>
  )
}
