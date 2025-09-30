import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  layout("layouts/note.tsx", [index("routes/index.tsx")]),
  route("editor", "routes/home.tsx"),
  route("graph", "routes/graph.tsx")
] satisfies RouteConfig
