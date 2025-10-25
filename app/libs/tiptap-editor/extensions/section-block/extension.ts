import { type ChainedCommands, type Editor, findParentNodeClosestToPos, Node } from "@tiptap/core"
import { type Node as PMNode } from "@tiptap/pm/model"
import { SECTION_BLOCK } from "../../constants"

const hasAnySectionBlock = (editor: Editor) => {
  const nodes = editor.$nodes(SECTION_BLOCK)
  return nodes !== null && nodes.length > 0
}

const getActiveSectionBlock = (editor: Editor) => {
  const $head = editor.state.selection.$head
  return findParentNodeClosestToPos($head, (node) => node.type.name === SECTION_BLOCK)
}

const contentRangeOfNode = (pos: number, node: PMNode) => {
  // 内部コンテンツだけを選択（自身の先頭+1 〜 自身の末尾-1）
  const from = pos + 1
  const to = pos + node.nodeSize - 1
  return { from, to }
}

const unwrapActiveSectionBlock = (
  chain: () => ChainedCommands,
  active: { pos: number; node: PMNode }
) => {
  const { from, to } = contentRangeOfNode(active.pos, active.node)
  return chain()
    .setTextSelection({ from, to })
    .toggleWrap(SECTION_BLOCK)
    .setTextSelection(from) // キャレットを元の位置に戻す
    .run()
}

const wrapAtSelection = (editor: Editor, chain: () => ChainedCommands) => {
  const { from } = editor.state.selection
  return chain().toggleWrap(SECTION_BLOCK).setTextSelection(from).run()
}

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
          const editor = this.editor

          // セクションブロックが1つもなければ通常の wrap を試みる
          if (!hasAnySectionBlock(editor)) {
            return chain().toggleWrap(SECTION_BLOCK).run()
          }

          const activeSectionBlock = getActiveSectionBlock(editor)

          // セクション外：現在の選択位置を基準に wrap
          if (!activeSectionBlock) {
            return wrapAtSelection(editor, chain)
          }

          // セクション内：子コンテンツ全体を選択して unwrap
          return unwrapActiveSectionBlock(chain, activeSectionBlock)
        }
    }
  }
})
