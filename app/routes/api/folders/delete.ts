import { delay } from "~/libs/debug"
import type { Route } from "./+types/delete"
import { deleteFolder } from "~/units/folder/service.server"

export async function action({ params }: Route.ActionArgs) {
  const folderId = Number(params.folderId)

  // [for debug]
  // await delay(5000)

  return deleteFolder(folderId)
    .then((deletedFolder) => ({ ok: true, ...deletedFolder }))
    .catch((err) => {
      console.error("Failed to delete folder", err)
      return { ok: false, message: "フォルダの削除に失敗しました", target: "Folder" }
    })
}
