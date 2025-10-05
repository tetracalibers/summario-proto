import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  layout("layouts/editor-page-layout.tsx", [route("terms/:termId", "routes/term.tsx")]),
  ...prefix("api", [
    route("save/:termId", "routes/api/save.ts"),
    route("miniview/:termId", "routes/api/miniview.ts")
  ])
] satisfies RouteConfig
