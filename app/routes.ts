import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  layout("layouts/editor-page-layout.tsx", [route("terms/:termId", "routes/term.tsx")]),
  route("editor", "routes/home.tsx"),
  route("graph", "routes/graph.tsx")
] satisfies RouteConfig
