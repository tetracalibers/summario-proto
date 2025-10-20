import { useEffect, useRef } from "react"
import { Network } from "vis-network"
import { DataSet } from "vis-data"

interface Props {
  nodes: { id: number; title: string }[]
  edges: { source: number; target: number }[]
  centerId: number
  onNodeClick: (nodeId: number) => void
}

const NetworkGraph = ({ nodes, edges, centerId, onNodeClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: node.title,
        shape: "dot",
        size: node.id === centerId ? 20 : 12,
        color: node.id === centerId ? "#FF90BC" : "#C6E7FF"
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

    const network = new Network(ref.current, { nodes: visNodes, edges: visEdges }, options)

    network.on("click", (params: { nodes: (string | number)[] }) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        onNodeClick(Number(nodeId))
      }
    })

    return () => {
      network.destroy()
    }
  }, [nodes, edges, centerId])

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
