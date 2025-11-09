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
    .then((newItem) => ({ ok: true, ...newItem }))
    .catch((err) => {
      console.error("Failed to create a new " + type, err)
      const messageBase =
        type === "folder" ? "フォルダの新規作成に失敗しました" : "新規作成に失敗しました"
      return data(
        {
          title: "ERROR",
          message: messageBase + ": " + name
        },
        { status: 500 }
      )
    })
}
