import { createEmptyTerm } from "~/units/term/service.server"
import type { Route } from "./+types/new"
import { data } from "react-router"
import { delay } from "~/libs/debug"

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
          title: "ERROR",
          message: "新規作成に失敗しました: " + title
        },
        { status: 500 }
      )
    })
}
