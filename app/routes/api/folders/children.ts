import { getFolder } from "~/queries/folder-detail/reader.server"
import type { Route } from "./+types/children"
import { getFolderChildren } from "~/queries/folder-detail/reader.server"

export async function loader({ params }: Route.ActionArgs) {
  const { folderId } = params

  const id = folderId === "root" ? null : Number(folderId)
  if (id !== null && isNaN(id)) {
    throw new Response("Invalid folder ID", { status: 400 })
  }

  const current = await getFolder(id)
  const children = await getFolderChildren(id)

  return { current, ...children }
}
