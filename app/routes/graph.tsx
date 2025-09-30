import NetworkGraph from "~/components/network-graph/NetworkGraph"
import { findRelatedTerms } from "~/service/related-term"
import type { Route } from "./+types/graph"

export async function loader() {
  // TODO: 本来は /graph/:termId のようなパスから termId を取得する
  const termId = 1
  const { nodes, edges } = await findRelatedTerms(termId)
  return { nodes, edges, centerId: termId }
}

export default function GraphPage({ loaderData }: Route.ComponentProps) {
  const { nodes, edges, centerId } = loaderData
  return <NetworkGraph nodes={nodes} edges={edges} centerId={centerId} />
}
