import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import AliasList from "./AliasList"
import { ALIAS_LIST } from "../../constants"
import type { Alias } from "~/units/alias/types"

interface AliasListOptions {
  initials: Alias[]
}

export const AliasListNode = Node.create<AliasListOptions>({
  name: ALIAS_LIST,
  group: "aliases",
  addOptions() {
    return { initials: [] }
  },
  addAttributes() {
    return {
      initials: {
        default: JSON.stringify(this.options.initials)
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
