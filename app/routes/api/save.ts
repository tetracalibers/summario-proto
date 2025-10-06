import { saveTermContentAndMeta } from "./../../service/term"
import type { Route } from "./+types/save"
import { data } from "react-router"

const joinTitles = (items: { title: string }[]) => {
  return items.map((i) => i.title).join(", ")
}

export async function action({ request, params }: Route.ActionArgs) {
  const termId = Number(params.termId)
  const requestData = await request.json()
  const result = await saveTermContentAndMeta(termId, requestData)

  if (!result.ok) {
    const errors = result.rejected.map((r) => {
      switch (r.key) {
        case "content":
          return { title: "コンテンツの更新エラー", message: "コンテンツの保存に失敗しました" }
        case "alias.add":
          return {
            title: "Aliasの更新エラー",
            message: "追加に失敗しました: " + joinTitles(r.targets)
          }
        case "alias.remove":
          return {
            title: "Aliasの更新エラー",
            message: "削除に失敗しました: " + joinTitles(r.targets)
          }
        case "related.add":
          return {
            title: "Related Termsの更新エラー",
            message: "追加に失敗しました: " + joinTitles(r.targets)
          }
        case "related.remove":
          return {
            title: "Related Termsの更新エラー",
            message: "削除に失敗しました: " + joinTitles(r.targets)
          }
        default:
          return { title: "Error", message: "不明なエラーが発生しました" }
      }
    })

    return data({ ok: false, errors } as const, { status: 500 })
  }

  return result
}
