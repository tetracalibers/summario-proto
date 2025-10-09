import {
  addEdge,
  ConnectionLineType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type Edge,
  reconnectEdge
} from "@xyflow/react"
import { useCallback } from "react"
import { getLayoutedElements } from "./layout"
import { FileNode } from "./FileNode"
import { FolderNode } from "./FolderNode"

const customNodes = {
  file: FileNode,
  folder: FolderNode
}

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

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
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
      nodeTypes={customNodes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      attributionPosition="bottom-left"
    />
  )
}
