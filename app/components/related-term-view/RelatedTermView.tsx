import { useFetcher } from "react-router"
import MiniView from "../mini-view/MiniView"
import NetworkGraph, { type NetworkGraphProps } from "../network-graph/NetworkGraph"
import type { loader } from "~/routes/miniview"

type Props = Pick<NetworkGraphProps, "nodes" | "edges"> & {
  termId: string
}

export default function RelatedTermView({ nodes, edges, termId }: Props) {
  const fetcher = useFetcher<typeof loader>()

  return (
    <>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        centerId={Number(termId)}
        onNodeClick={(nodeId) => {
          fetcher.load(`/miniview/${nodeId}`)
        }}
      />
      {fetcher.data && <MiniView contentJson={fetcher.data} />}
    </>
  )
}
