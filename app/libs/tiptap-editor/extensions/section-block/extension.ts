import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import SectionBlock from "./SectionBlock"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sectionBlock: {
      deleteSectionBlock: () => ReturnType
      toggleSectionBlock: () => ReturnType
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
        },

      toggleSectionBlock:
        () =>
        ({ chain }) => {
          const { editor } = this

          const $sectionBlocks = editor.$nodes("sectionBlock")
          if (!$sectionBlocks) {
            return chain().toggleWrap("sectionBlock").run()
          }

          const activeNodePos = editor.state.selection.$head
          const activeSectionBlock = $sectionBlocks.find((node) => {
            return (
              activeNodePos.pos >= node.pos && activeNodePos.pos <= node.pos + node.node.nodeSize
            )
          })

          // sectionBlock外：通常のtoggleWrap
          if (!activeSectionBlock) {
            return chain().toggleWrap("sectionBlock").run()
          }

          // sectionBlock内：子コンテンツ全体を選択してアンラップ
          const from = activeSectionBlock.pos + 1
          const to = activeSectionBlock.pos + activeSectionBlock.node.nodeSize - 1

          return chain()
            .setTextSelection({ from, to })
            .toggleWrap("sectionBlock")
            .setTextSelection(to) // 選択解除してカーソルだけ戻す
            .run()
        }
    }
  }
})
