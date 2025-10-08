import {
  ReactFlow,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback } from "react"

const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } }
]

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }]

export default function FolderMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      />
    </div>
  )
}
