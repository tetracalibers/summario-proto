import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import AliasList from "./AliasList"
import { ALIAS_LIST } from "../../constants"

export const AliasListNode = Node.create({
  name: ALIAS_LIST,
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
