import NetworkGraph from "~/components/network-graph/NetworkGraph"
import { getOutgoingRelatedTermsDeep } from "~/repository/related"
import type { Route } from "./+types/graph"

export async function loader() {
  const data = await getOutgoingRelatedTermsDeep(1, 3)

  return { data }
}

export default function GraphPage({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData
  console.log("loaderData", data)
  return <NetworkGraph />
}
