import { useEffect, useRef } from "react"
import { Network } from "vis-network"
import { DataSet } from "vis-data"

interface NetworkGraphProps {
  nodes: { id: number; title: string }[]
  edges: { source: number; target: number }[]
  centerId: number
}

const NetworkGraph = ({ nodes, edges, centerId }: NetworkGraphProps) => {
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
        color: node.id === centerId ? "#ff9900" : "#97c2fc"
      }))
    )

    const visEdges = new DataSet(
      edges.map((edge, index) => ({
        id: index,
        from: edge.source,
        to: edge.target,
        arrows: "to"
      }))
    )

    const options = {
      physics: {
        barnesHut: {
          gravitationalConstant: -4000
        }
      },
      interaction: {
        multiselect: true
      },
      nodes: {
        font: {
          size: 14,
          color: "#333"
        },
        borderWidth: 2
      },
      edges: {
        color: "#cccccc",
        width: 1
      }
    }

    const network = new Network(ref.current, { nodes: visNodes, edges: visEdges }, options)

    network.on("click", (params: { nodes: (string | number)[] }) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0]
        const node = visNodes.get(nodeId)
        console.log("Clicked node:", node)
      }
    })

    return () => {
      network.destroy()
    }
  }, [nodes, edges, centerId])

  return (
    <div>
      <div style={{ height: 800, width: "100%" }} ref={ref} />
    </div>
  )
}

export default NetworkGraph
