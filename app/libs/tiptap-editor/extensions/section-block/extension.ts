import { findParentNodeClosestToPos, Node } from "@tiptap/core"
import { SECTION_BLOCK } from "../../constants"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    sectionBlock: {
      deleteSectionBlock: () => ReturnType
      toggleSectionBlock: () => ReturnType
    }
  }
}

export const SectionBlockNode = Node.create({
  name: SECTION_BLOCK,
  group: "section",
  content: "block*",
  draggable: true,

  parseHTML() {
    return [{ tag: "section-block" }]
  },

  renderHTML() {
    return [
      "div",
      { class: "node-section_block" },
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

          const $sectionBlocks = editor.$nodes(SECTION_BLOCK)
          if (!$sectionBlocks) {
            return chain().toggleWrap(SECTION_BLOCK).run()
          }

          const activeNodePos = editor.state.selection.$head
          const activeSectionBlock = findParentNodeClosestToPos(
            activeNodePos,
            (node) => node.type.name === SECTION_BLOCK
          )

          // section_block外：通常のtoggleWrap
          if (!activeSectionBlock) {
            const { from } = editor.state.selection
            return chain().toggleWrap(SECTION_BLOCK).setTextSelection(from).run()
          }

          // section_block内：子コンテンツ全体を選択してアンラップ
          const from = activeSectionBlock.pos + 1 // section_blockノード直下の最初の子ノード開始位置
          const to = activeSectionBlock.pos + activeSectionBlock.node.nodeSize - 1 // section_blockノード直下の最後の子ノード末尾位置

          return chain()
            .setTextSelection({ from, to })
            .toggleWrap(SECTION_BLOCK)
            .setTextSelection(from) // キャレットを元の位置に戻す
            .run()
        }
    }
  }
})
