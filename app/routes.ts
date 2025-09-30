import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  layout("layouts/editor-page-layout.tsx", [route("terms/:termId", "routes/term.tsx")]),
  route("editor", "routes/home.tsx")
] satisfies RouteConfig
