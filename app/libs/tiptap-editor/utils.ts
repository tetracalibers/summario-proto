import type { JSONContent } from "@tiptap/react"
import { SECTION_BLOCK, TITLE_BLOCK } from "./constants"

export const defaultContentJson = (title: string) => ({
  type: "doc",
  content: [{ type: TITLE_BLOCK, content: [{ type: "text", text: title }] }]
})

export const judgeContentEmpty = (doc: JSONContent) => {
  // ルート content が無い/空 → 空
  const nodes = doc.content ?? []
  if (nodes.length === 0) return true

  // ルートに 1 ノードのみで、
  if (nodes.length === 1) {
    // そのノードが title_block → 空
    const first = nodes[0]
    if (first.type === TITLE_BLOCK) return true

    // そのノードの content が無い/空 → 空
    const children = first.content ?? []
    if (children.length === 0) return true
  }

  return false
}

export const createSectionBlockJson = (title: string) => ({
  type: SECTION_BLOCK,
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: title }] },
    { type: "paragraph" }
  ]
})
