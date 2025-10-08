import { type Node, type Edge } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { getLayoutedElements } from "~/components/folder-map/layout"
import FolderMap from "~/components/folder-map/FolderMap"

const position = { x: 0, y: 0 }

const initialNodes: Node[] = [
  { id: "1", position, data: { label: "1" }, type: "input" },
  { id: "2", position, data: { label: "2" }, type: "output" }
]
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }]

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
)

export default function FolderMapPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FolderMap layoutedNodes={layoutedNodes} layoutedEdges={layoutedEdges} />
    </div>
  )
}
