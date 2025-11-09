import { data } from "react-router"
import type { Route } from "./+types/edit"
import { saveTermContents } from "~/usecases/term-edit/feature.server"
import { delay } from "~/libs/debug"

const joinTitles = (items: { title: string }[]) => {
  return items.map((i) => i.title).join(", ")
}

export async function action({ request, params }: Route.ActionArgs) {
  const termId = Number(params.termId)
  const requestData = await request.json()

  // [for debug]
  // await delay(5000)

  const result = await saveTermContents(termId, requestData)

  if (!result.ok) {
    const errors = result.rejected.map((r) => {
      switch (r.key) {
        case "content":
          return { title: "ERROR", message: "コンテンツの保存に失敗しました" }
        case "alias.add":
          return {
            title: "ERROR: Alias",
            message: "追加に失敗しました: " + joinTitles(r.targets)
          }
        case "alias.remove":
          return {
            title: "ERROR: Alias",
            message: "削除に失敗しました: " + joinTitles(r.targets)
          }
        case "related.add":
          return {
            title: "ERROR: Related Terms",
            message: "追加に失敗しました: " + joinTitles(r.targets)
          }
        case "related.remove":
          return {
            title: "ERROR: Related Terms",
            message: "削除に失敗しました: " + joinTitles(r.targets)
          }
        default:
          return { title: "ERROR", message: "不明なエラーが発生しました" }
      }
    })

    return data(errors, { status: 500 })
  }

  return result
}
