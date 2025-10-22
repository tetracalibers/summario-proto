import { useEffect, useRef } from "react"
import { Network, type Node } from "vis-network"
import { DataSet } from "vis-data"
import { useTermTitleState } from "~/units/term/ui.hooks"

interface Props {
  nodes: { id: number; title: string }[]
  edges: { source: number; target: number }[]
  centerNode: { id: number; title: string } | null
  onNodeClick: (nodeId: number) => void
}

const NetworkGraph = ({ nodes, edges, centerNode, onNodeClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const visNodesRef = useRef<DataSet<Node> | null>(null)
  const { termTitle: editedCenterNodeTitle } = useTermTitleState()

  useEffect(() => {
    if (!ref.current) return
    if (!centerNode) return

    visNodesRef.current = new DataSet(
      [centerNode, ...nodes].map((node) => ({
        id: node.id,
        label: node.id === centerNode.id ? editedCenterNodeTitle || centerNode.title : node.title,
        shape: "dot",
        size: node.id === centerNode.id ? 20 : 12,
        color: node.id === centerNode.id ? "#FF90BC" : "#C6E7FF"
      }))
    )

    const visEdges = new DataSet(
      edges.map((edge, index) => ({
        id: index,
        from: edge.source,
        to: edge.target
      }))
    )

    const options = {
      physics: {
        barnesHut: {
          gravitationalConstant: -4000
        }
      },
      interaction: {
        zoomView: false
      },
      nodes: {
        font: {
          size: 14,
          color: "#295F98"
        },
        borderWidth: 1
      },
      edges: {
        color: "#D2E0FB",
        width: 1
      }
    }

    const network = new Network(
      ref.current,
      { nodes: visNodesRef.current, edges: visEdges },
      options
    )

    network.on("click", (params: { nodes: (string | number)[] }) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        onNodeClick(Number(nodeId))
      }
    })

    return () => {
      network.destroy()
      visNodesRef.current = null
    }
  }, [nodes, edges, centerNode])

  // centerNodeTitleが変わったらノードのラベルを更新
  useEffect(() => {
    if (!centerNode) return
    if (!visNodesRef.current) return

    visNodesRef.current.update({
      id: centerNode.id,
      label: editedCenterNodeTitle || centerNode.title
    })
  }, [editedCenterNodeTitle, centerNode])

  return (
    <div
      style={{
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-default)",
        height: "220px",
        width: "100%"
      }}
      ref={ref}
    />
  )
}

export default NetworkGraph
