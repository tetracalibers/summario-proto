import type { Route } from "./+types/move"
import { delay } from "~/libs/debug"
import { moveEntriesIntoSubfolder } from "~/usecases/folder-explorer/move-to-folder/feature.server"
import type { EntriesResults } from "~/usecases/folder-explorer/move-to-folder/types"

const entryLabel = (type: "file" | "folder") => (type === "file" ? "ノート" : "フォルダ")

const successMessage = (type: "file" | "folder", entry: EntriesResults, parentName: string) => {
  const { count, names } = entry
  return `${count}件の${entryLabel(type)}を「${parentName}」に移動しました: ${names.join(", ")}`
}

const failureMessage = (type: "file" | "folder", entry: EntriesResults) => {
  const { count, names } = entry
  return `${count}件の${entryLabel(type)}の移動に失敗しました: ${names.join(", ")}`
}

interface MoveActionResponse {
  messages: { type: "error" | "success"; text: string }[]
  success: { file: number[]; folder: number[] }
  errorsCount: number
}

export async function action({ request }: Route.ActionArgs) {
  const requestData = await request.json()
  const { targets, newParent } = requestData

  // [for debug]
  //await delay(5000)

  const result = await moveEntriesIntoSubfolder({ targets, newParentId: newParent.id })

  return result.details.reduce<MoveActionResponse>(
    (acc, detail) => {
      if (detail.count === 0) return acc

      if (detail.status === "SUCCESS") {
        acc.messages.push({
          type: "success",
          text: successMessage(detail.type, detail, newParent.name)
        })
        acc.success[detail.type] = detail.ids
      } else {
        acc.messages.push({
          type: "error",
          text: failureMessage(detail.type, detail)
        })
        acc.errorsCount += detail.count
      }

      return acc
    },
    { messages: [], errorsCount: 0, success: { file: [], folder: [] } }
  )
}
