import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import AliasList from "./AliasList"

export const AliasListNode = Node.create({
  name: "alias_list",
  group: "aliases",
  addAttributes() {
    return {
      initials: {
        default: JSON.stringify([])
      }
    }
  },
  parseHTML() {
    return [{ tag: "alias-list" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["alias-list", mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    // @ts-ignore
    return ReactNodeViewRenderer(AliasList)
  }
})
