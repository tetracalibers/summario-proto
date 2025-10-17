import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route("terms/:termId", "routes/term.tsx"),
  route("folder-map", "routes/folder-map.tsx"),

  ...prefix("api", [
    route("terms/:termId/preview", "routes/api/terms/preview.ts"),
    route("terms/:termId/edit", "routes/api/terms/edit.ts"),
    route("terms/new", "routes/api/terms/new.ts"),
    route("terms/:termId/delete", "routes/api/terms/delete.ts"),

    route("folder/:folderId", "routes/api/folder.ts")
  ])
] satisfies RouteConfig
