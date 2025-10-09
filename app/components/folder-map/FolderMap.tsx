import {
  addEdge,
  ConnectionLineType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type Edge,
  reconnectEdge,
  Panel
} from "@xyflow/react"
import { useCallback } from "react"
import { getLayoutedElements } from "./layout"
import { FileNode } from "./node/FileNode"
import { FolderNode } from "./node/FolderNode"
import SaveButton from "./button/SaveButton"
import AlignButton from "./button/AlignButton"
import panelStyles from "./panel.module.css"
import NewFileNode from "./draggable/NewFileNode"
import NewFolderNode from "./draggable/NewFolderNode"

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
      setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SimpleBezier }, eds)),
    [setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
  )

  const layout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges)

    setNodes([...layoutedNodes])
    setEdges([...layoutedEdges])
  }, [nodes, edges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={customNodes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      connectionLineType={ConnectionLineType.SimpleBezier}
      fitView
      attributionPosition="bottom-left"
    >
      <Panel position="top-right">
        <div className={panelStyles.panel_inner}>
          <AlignButton onClick={() => layout()} />
          <SaveButton />
          <NewFileNode />
          <NewFolderNode />
        </div>
      </Panel>
    </ReactFlow>
  )
}
