import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import SectionBlock from "./SectionBlock"

export default Node.create({
  name: "sectionBlock",

  group: "block",

  content: "block*",

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: ""
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: "section-block"
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["section-block", mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionBlock)
  }
})
