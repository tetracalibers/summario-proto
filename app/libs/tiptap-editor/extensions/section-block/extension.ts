import { mergeAttributes, Node } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sectionBlock: {
      deleteSectionBlock: () => ReturnType
      toggleSectionBlock: () => ReturnType
    }
  }
}

export default Node.create({
  name: "section_block",
  group: "section",
  content: "block*",
  draggable: true,

  parseHTML() {
    return [{ tag: "section-block" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "node-section_block" }),
      ["div", { class: "node-section_block__content" }, 0]
    ]
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

          const $sectionBlocks = editor.$nodes("section_block")
          if (!$sectionBlocks) {
            return chain().toggleWrap("section_block").run()
          }

          const activeNodePos = editor.state.selection.$head
          const activeSectionBlock = $sectionBlocks.find((node) => {
            return (
              activeNodePos.pos >= node.pos && activeNodePos.pos <= node.pos + node.node.nodeSize
            )
          })

          // section_block外：通常のtoggleWrap
          if (!activeSectionBlock) {
            return chain().toggleWrap("section_block").run()
          }

          // section_block内：子コンテンツ全体を選択してアンラップ
          const from = activeSectionBlock.pos + 1
          const to = activeSectionBlock.pos + activeSectionBlock.node.nodeSize - 1

          return chain()
            .setTextSelection({ from, to })
            .toggleWrap("section_block")
            .setTextSelection(to) // 選択解除してカーソルだけ戻す
            .run()
        }
    }
  }
})
