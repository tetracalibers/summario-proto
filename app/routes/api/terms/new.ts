import { createEmptyTerm } from "~/units/term/service.server"
import type { Route } from "./+types/new"
import { data } from "react-router"

export async function action({ request }: Route.ActionArgs) {
  const requestData = await request.json()
  const { title, folderId } = requestData

  // [for debug]
  // await delay(5000)

  return createEmptyTerm(title, folderId)
    .then((term) => ({ ok: true, ...term }))
    .catch((err) => {
      console.error("Failed to create a new term", err)
      return data(
        {
          title: "Termの新規作成エラー",
          message: "新規作成に失敗しました: " + title
        },
        { status: 500 }
      )
    })
}
