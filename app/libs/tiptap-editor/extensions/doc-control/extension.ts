import { Extension, findParentNodeClosestToPos } from "@tiptap/core"
import { type EditorState, TextSelection } from "@tiptap/pm/state"
import { SECTION_BLOCK, TITLE_BLOCK } from "../../constants"
import type { ResolvedPos } from "@tiptap/pm/model"

const resolvedPrevPos = (state: EditorState, $from: ResolvedPos) => {
  const posBeforeParent = $from.before()
  if (posBeforeParent < 1) return null
  return state.doc.resolve(posBeforeParent - 1)
}

const isLastChildInParent = ($pos: ResolvedPos) => $pos.parentOffset === $pos.parent.nodeSize - 2
const caretAtBlockEnd = ($pos: ResolvedPos) => $pos.pos === $pos.end()

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      setCursorToPrevNodeEnd: (textOffset?: number) => ReturnType
      clearTitleContent: () => ReturnType
      deleteBlock: () => ReturnType
    }
  }
}

export const CustomDocumentControl = Extension.create({
  name: "custom-doc-control",

  addCommands() {
    return {
      setCursorToPrevNodeEnd:
        (textOffset = 0) =>
        ({ chain, state }) => {
          // テキスト途中の削除ではキャレット移動なし
          if (textOffset > 0) return true

          const { $from } = state.selection
          const $prev = resolvedPrevPos(state, $from)
          if (!$prev) return true // ドキュメント先頭なら何もしない

          const atEnd = caretAtBlockEnd($from)

          // 文書末尾（最後のノード末尾）にいる場合はドキュメント末尾へ
          if (isLastChildInParent($from) && atEnd) {
            return chain().setTextSelection(TextSelection.atEnd(state.doc)).run()
          }

          // ブロック末尾なら直前ブロック末尾へ
          if (atEnd) {
            return chain().setTextSelection(TextSelection.atEnd($prev.node())).run()
          }

          // それ以外は直前位置近傍へ
          return chain().setTextSelection(TextSelection.near($prev, -1)).run()
        },

      clearTitleContent:
        () =>
        ({ chain }) => {
          const titleLength = this.editor.state.doc.content.firstChild?.content.size || 0
          const range = { from: 1, to: titleLength + 1 }
          return chain().insertContentAt(range, "").run()
        },

      deleteBlock:
        () =>
        ({ chain }) => {
          const { editor } = this

          const { $from, $to } = editor.state.selection

          // 範囲選択されているときはその範囲を削除
          if ($from.pos !== $to.pos) {
            // ドキュメントの最初のノードが選択されている場合、deleteSelection()ではエラーになる…
            if ($from.pos === 1) {
              const range = { from: $from.pos, to: $to.pos }
              return chain()
                .focus()
                .deleteRange(range)
                .setCursorToPrevNodeEnd($from.textOffset)
                .run()
            }

            return chain().focus().deleteSelection().setCursorToPrevNodeEnd($from.textOffset).run()
          }

          const activeNodePos = $from
          const activeNode = activeNodePos.parent

          // トップタイトルはコンテンツのクリアのみ
          if (activeNode.type.name === TITLE_BLOCK) {
            return chain().focus().clearTitleContent().run()
          }

          // トップレベルのノードはそのまま削除
          if (activeNodePos.depth === 1) {
            return chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
          }

          // リスト内の場合、リストアイテムごと削除
          // activeNodeはparagraphになっているが、その親であるli:has(> p)要素を削除する
          if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
            return chain()
              .focus()
              .selectParentNode()
              .deleteSelection()
              .setCursorToPrevNodeEnd()
              .run()
          }

          // blockquoteの場合も同様にp要素の親要素を削除する
          if (editor.isActive("blockquote")) {
            return chain()
              .focus()
              .selectParentNode()
              .deleteSelection()
              .setCursorToPrevNodeEnd()
              .run()
          }

          if (editor.isActive(SECTION_BLOCK)) {
            const activeSectionBlock = findParentNodeClosestToPos(
              activeNodePos,
              (node) => node.type.name === SECTION_BLOCK
            )
            if (!activeSectionBlock) return false

            // 子が複数ある場合は現在のノードだけ削除
            if (activeSectionBlock.node.childCount > 1) {
              return chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
            }

            // 子が1つだけの場合はセクションブロックごと削除
            return chain().focus().deleteSectionBlock().setCursorToPrevNodeEnd().run()
          }

          return false
        }
    }
  }
})
