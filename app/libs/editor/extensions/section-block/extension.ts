import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import SectionBlock from "./SectionBlock"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sectionBlock: {
      deleteSectionBlock: () => ReturnType
    }
  }
}

export default Node.create({
  name: "sectionBlock",

  group: "section",

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
  },

  addCommands() {
    return {
      deleteSectionBlock:
        () =>
        ({ chain }) => {
          return chain().deleteNode(this.name).run()
        }
    }
  }
})
