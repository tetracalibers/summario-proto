import MiniView from "./MiniView"
import NetworkGraph from "./NetworkGraph"
import { useRelatedGraphUi } from "~/usecases/term-relation-graph/ui.hooks"
import { useMiniviewUi } from "~/usecases/miniview/ui.hooks"
import type { TermNode } from "~/usecases/term-relation-graph/types"

interface Props {
  centerNode: TermNode
}

export default function RelatedTermView({ centerNode }: Props) {
  const { nodes, edges } = useRelatedGraphUi(centerNode)
  const { data, setMiniviewTermId, isVisibleMiniview } = useMiniviewUi(centerNode.id)

  return (
    <>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        centerId={centerNode.id}
        onNodeClick={(nodeId) => {
          setMiniviewTermId(nodeId)
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
        {data && isVisibleMiniview ? (
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
