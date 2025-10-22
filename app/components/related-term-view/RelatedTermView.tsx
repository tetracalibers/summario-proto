import MiniView from "./MiniView"
import NetworkGraph from "./NetworkGraph"
import { useRelatedGraphUi } from "~/usecases/term-relation-graph/ui.hooks"
import { useMiniviewUi } from "~/usecases/miniview/ui.hooks"
import type { TermNode } from "~/usecases/term-relation-graph/types"
import ScrollArea from "../scroll-area/ScrollArea"

interface Props {
  initialCenterNode: TermNode
}

export default function RelatedTermView({ initialCenterNode }: Props) {
  const { nodes, edges, centerNode } = useRelatedGraphUi(initialCenterNode)
  const { data, setMiniviewTermId, isVisibleMiniview } = useMiniviewUi(initialCenterNode.id)

  return (
    <>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        centerNode={centerNode}
        onNodeClick={(nodeId) => {
          setMiniviewTermId(nodeId)
        }}
      />
      <div
        style={{
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-default)",
          containerType: "size"
        }}
      >
        {data && isVisibleMiniview ? (
          <ScrollArea style={{ height: "100%", padding: "0.75rem" }}>
            <MiniView contentHTML={data} />
          </ScrollArea>
        ) : (
          <p
            style={{
              display: "grid",
              placeItems: "center",
              height: "100%",
              margin: 0,
              textAlign: "center",
              color: "var(--mantine-color-gray-6)",
              padding: "0.75rem"
            }}
          >
            Clicking a node on the graph...
          </p>
        )}
      </div>
    </>
  )
}
