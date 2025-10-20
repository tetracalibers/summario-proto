import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route("terms/:termId", "routes/term.tsx"),
  route("folder-map", "routes/folder-map.tsx"),

  ...prefix("api", [
    route("terms/:termId/preview", "routes/api/terms/preview.ts"),
    route("terms/:termId/edit", "routes/api/terms/edit.ts"),
    route("terms/new", "routes/api/terms/new.ts"),
    route("terms/:termId/delete", "routes/api/terms/delete.ts"),

    route("folders/:folderId/children", "routes/api/folders/children.ts"),
    route("folders/:folderId/rename", "routes/api/folders/rename.ts"),
    route("folders/new", "routes/api/folders/new.ts"),
    route("folders/:folderId/delete", "routes/api/folders/delete.ts")
  ])
] satisfies RouteConfig
