import { createEmptyTerm } from "~/units/term/service.server"
import type { Route } from "./+types/new"
import { data } from "react-router"
import { delay } from "~/libs/debug"
import { createEmptyFolder } from "~/units/folder/service.server"

export async function action({ request }: Route.ActionArgs) {
  const requestData = await request.json()
  const { name, parentId, type } = requestData

  // [for debug]
  // await delay(5000)

  const create =
    type === "folder"
      ? () => createEmptyFolder(name, parentId)
      : () => createEmptyTerm(name, parentId)

  return create()
    .then((term) => ({ ok: true, ...term }))
    .catch((err) => {
      console.error("Failed to create a new term", err)
      return data(
        {
          title: "ERROR",
          message: "新規作成に失敗しました: " + name
        },
        { status: 500 }
      )
    })
}
