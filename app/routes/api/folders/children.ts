import { getFolder, getFolderContents } from "~/service/folder"
import type { Route } from "./+types/children"

export async function loader({ params }: Route.ActionArgs) {
  const { folderId } = params

  const id = folderId === "root" ? null : Number(folderId)
  if (id !== null && isNaN(id)) {
    throw new Response("Invalid folder ID", { status: 400 })
  }

  const current = await getFolder(id)
  const children = await getFolderContents(id)

  return { current, ...children }
}
