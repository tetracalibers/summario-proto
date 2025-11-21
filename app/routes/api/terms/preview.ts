import type { Route } from "./+types/preview"
import { renderToHTMLString } from "@tiptap/static-renderer"
import { tiptapExtensions } from "~/libs/tiptap-editor/extensions"
import type { JSONContent } from "@tiptap/react"
import { getTerm } from "~/queries/term-detail/reader.server"
import { createPreviewJson } from "~/libs/tiptap-editor/utils"

export async function loader({ params }: Route.ActionArgs) {
  const term = await getTerm(Number(params.termId))
  const initialJSON = createPreviewJson(term.title, term.content as JSONContent[])

  const html = renderToHTMLString({
    content: initialJSON,
    extensions: tiptapExtensions({ initialJSON })
  })

  return html
}
