import type { JSONContent } from "@tiptap/react"
import { ALIAS_LIST, SECTION_BLOCK, TITLE_BLOCK } from "./constants"
import type { Alias } from "~/units/alias/types"

export const defaultContentJson = () => [{ type: "paragraph" }]

export interface EditorData {
  title: string
  aliases: Alias[]
  content: JSONContent[]
}
export const createEditorJson = ({ title, aliases, content }: EditorData) => ({
  type: "doc",
  content: [
    { type: TITLE_BLOCK, content: [{ type: "text", text: title }] },
    { type: ALIAS_LIST, attrs: { aliases: aliases } },
    ...content
  ]
})

export const createPreviewJson = (title: string, content: JSONContent[]) => ({
  type: "doc",
  content: [{ type: TITLE_BLOCK, content: [{ type: "text", text: title }] }, ...content]
})

export const getMainContentFromDoc = (doc: JSONContent): JSONContent[] => {
  const nodes = doc.content ?? []
  if (nodes.length <= 2) return []
  return nodes.slice(2) // Remove title and alias list
}

export const judgeContentEmpty = (doc: JSONContent): boolean => {
  const nodes = doc.content ?? []
  if (nodes.length === 0) return true
  if (nodes.length > 1) return false

  const firstNode = nodes[0]
  return (firstNode.content ?? []).length === 0
}

export const createSectionBlockJson = (title: string) => ({
  type: SECTION_BLOCK,
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: title }] },
    { type: "paragraph" }
  ]
})
