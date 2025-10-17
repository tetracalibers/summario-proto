import MiniView from "../mini-view/MiniView"
import NetworkGraph from "../network-graph/NetworkGraph"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
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
import { useQuery } from "@tanstack/react-query"

interface Props {
  centerNode: Node
}

export default function RelatedTermView({ centerNode }: Props) {
  const nodes = useAtomValue(nodesAtom)
  const edges = useAtomValue(edgesAtom)

  const setCenterNode = useSetAtom(centerNodeAtom)
  useEffect(() => {
    setCenterNode(centerNode)
  }, [centerNode])

  const [miniviewNodeId, setMiniviewNodeId] = useAtom(miniviewNodeIdAtom)
  const existsInNodes = useAtomValue(existsMiniviewAtomInNodes)

  const { data } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: ["terms", "detail", miniviewNodeId, "preview"],
    queryFn: () => fetch(`/api/terms/${miniviewNodeId}/preview`).then((res) => res.text()),
    enabled: existsInNodes && miniviewNodeId !== null
  })

  return (
    <>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        centerId={centerNode.id}
        onNodeClick={(nodeId) => {
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
        {data && existsInNodes ? (
          <MiniView contentHTML={data} />
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
