import type { JSONContent } from "@tiptap/react"

export const judgeContentEmpty = (json: JSONContent) => {
  if (!json.content) return true
  if (json.content.length === 0) return true

  if (json.content.length === 1) {
    const firstNode = json.content[0]
    if (!firstNode.content) return true

    const children = firstNode.content
    if (children.length === 0) return true

    if (firstNode.type === "title_block") return true
  }

  return false
}

export const createSectionBlockJson = (title: string) => ({
  type: "section_block",
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: title }] },
    { type: "paragraph" }
  ]
})
