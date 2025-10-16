import { getTermById } from "~/service/term"
import type { Route } from "./+types/preview"
import { renderToHTMLString } from "@tiptap/static-renderer"
import { tiptapExtensions } from "~/components/editor/extensions"
import type { JSONContent } from "@tiptap/react"

export async function loader({ params }: Route.ActionArgs) {
  const term = await getTermById(Number(params.termId))
  const contentJson = term.content as JSONContent

  const html = renderToHTMLString({
    content: contentJson,
    extensions: tiptapExtensions(contentJson)
  })

  return html
}
