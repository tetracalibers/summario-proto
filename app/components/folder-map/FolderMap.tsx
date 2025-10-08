import {
  addEdge,
  ConnectionLineType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type Edge
} from "@xyflow/react"
import { useCallback } from "react"
import { getLayoutedElements } from "./layout"

interface Props {
  layoutedNodes: Node[]
  layoutedEdges: Edge[]
}

export default function FolderMap({ layoutedNodes, layoutedEdges }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    [setEdges]
  )

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      )

      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
    },
    [nodes, edges]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      attributionPosition="bottom-left"
    />
  )
}
