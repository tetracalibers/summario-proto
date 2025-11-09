import type { JSONContent } from "@tiptap/react"
import { SECTION_BLOCK, TITLE_BLOCK } from "./constants"

export const defaultContentJson = (title: string) => ({
  type: "doc",
  content: [{ type: TITLE_BLOCK, content: [{ type: "text", text: title }] }, { type: "paragraph" }]
})

export const judgeContentEmpty = (doc: JSONContent): boolean => {
  const nodes = doc.content ?? []
  if (nodes.length === 0) return true
  if (nodes.length > 2) return false

  const [first, second] = nodes
  const isEmptyParagraph = second?.type === "paragraph" && (second.content?.length ?? 0) === 0

  if (nodes.length === 1) return first?.type === TITLE_BLOCK
  return first?.type === TITLE_BLOCK && isEmptyParagraph
}

export const createSectionBlockJson = (title: string) => ({
  type: SECTION_BLOCK,
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: title }] },
    { type: "paragraph" }
  ]
})
