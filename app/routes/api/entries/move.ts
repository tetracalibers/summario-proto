import { data } from "react-router"
import type { Route } from "./+types/move"
import { delay } from "~/libs/debug"
import { moveEntriesIntoSubfolder } from "~/usecases/folder-explorer/move-to-folder/feature.server"

export async function action({ request }: Route.ActionArgs) {
  const requestData = await request.json()
  const { targets, newParent } = requestData

  // [for debug]
  //await delay(5000)

  const result = await moveEntriesIntoSubfolder({ targets, newParentId: newParent.id })

  if (!result.ok) {
    const errors = result.rejected.map((r) => {
      return r.type === "folder"
        ? { message: "フォルダの移動に失敗しました: " + r.name }
        : { message: "ノートの移動に失敗しました: " + r.name }
    })

    return data(errors, { status: 500 })
  }

  const countMoved = result.files.length - 1 + (result.folders.length - 1)

  return { ...result, message: `${countMoved}件のアイテムを「${newParent.name}」に移動しました。` }
}
