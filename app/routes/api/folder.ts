import { getFolder, getFolderContents } from "~/service/folder"
import type { Route } from "./+types/folder"

export async function loader({ params }: Route.ActionArgs) {
  const { folderId } = params

  const id = folderId === "root" ? null : Number(folderId)
  if (id !== null && isNaN(id)) {
    throw new Response("Invalid folder ID", { status: 400 })
  }

  const entries = await getFolderContents(id)
  const current = await getFolder(id)

  return { current, entries }
}
