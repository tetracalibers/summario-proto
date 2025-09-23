import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import SectionBlock from "./SectionBlock"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customExtension: {
      deleteSectionBlock: () => ReturnType
    }
  }
}

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
  },

  addCommands() {
    return {
      deleteSectionBlock:
        () =>
        ({ chain }) => {
          return chain().deleteNode(this.name).run()
        }
    }
  },

  onUpdate({ editor }) {
    // 中身が空になったらセクション自体も削除
    const activeNode = editor.state.selection.$head.parent
    if (activeNode.content.size === 0) {
      editor.chain().focus().deleteNode(this.name).run()
    }
  }
})
