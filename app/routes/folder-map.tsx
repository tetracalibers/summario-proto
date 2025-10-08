import "@xyflow/react/dist/style.css"
import { getLayoutedElements } from "~/components/folder-map/layout"
import FolderMap from "~/components/folder-map/FolderMap"
import { getFolderGraph } from "~/service/folder-map"
import type { Route } from "./+types/folder-map"

export async function loader() {
  const { nodes, edges } = await getFolderGraph()
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges)
  return { layoutedNodes, layoutedEdges }
}

export default function FolderMapPage({ loaderData }: Route.ComponentProps) {
  const { layoutedNodes, layoutedEdges } = loaderData

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FolderMap layoutedNodes={layoutedNodes} layoutedEdges={layoutedEdges} />
    </div>
  )
}
