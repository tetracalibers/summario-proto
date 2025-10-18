import type { Route } from "./+types/preview"
import { renderToHTMLString } from "@tiptap/static-renderer"
import { tiptapExtensions } from "~/libs/editor/extensions"
import type { JSONContent } from "@tiptap/react"
import { getTerm } from "~/queries/term-detail/reader.server"

export async function loader({ params }: Route.ActionArgs) {
  const term = await getTerm(params.termId)
  const contentJson = term.content as JSONContent

  const html = renderToHTMLString({
    content: contentJson,
    extensions: tiptapExtensions(contentJson)
  })

  return html
}
