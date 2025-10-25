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

const isRangeSelection = (state: EditorState) =>
  state.selection.$from.pos !== state.selection.$to.pos

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      setCursorToPrevNodeEnd: (textOffset?: number) => ReturnType
      clearTitleContent: () => ReturnType
      deleteSelectionSafely: () => ReturnType
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
          const titleSize = this.editor.state.doc.content.firstChild?.content.size ?? 0
          const range = { from: 1, to: titleSize + 1 }
          return chain().insertContentAt(range, "").run()
        },

      deleteSelectionSafely:
        () =>
        ({ chain, state }) => {
          const { $from, $to } = state.selection
          // ドキュメント先頭を含む範囲は deleteSelection() が不安定なため deleteRange を使う
          if ($from.pos === 1) {
            return chain().deleteRange({ from: $from.pos, to: $to.pos }).run()
          }
          return chain().deleteSelection().run()
        },

      deleteBlock:
        () =>
        ({ chain, state }) => {
          const editor = this.editor
          const $from = state.selection.$from
          const activeNode = $from.parent

          // 範囲選択はそのまま削除 → 直前終端へキャレット移動
          if (isRangeSelection(state)) {
            return chain()
              .focus()
              .deleteSelectionSafely()
              .setCursorToPrevNodeEnd($from.textOffset)
              .run()
          }

          // タイトル行は内容クリアのみ
          if (activeNode.type.name === TITLE_BLOCK) {
            return chain().focus().clearTitleContent().run()
          }

          // トップレベルノードはそのまま削除
          if ($from.depth === 1) {
            return chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
          }

          // リスト内：アイテムごと削除
          // activeNodeはparagraphになっているが、その親であるli:has(> p)要素を削除する
          if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
            return chain()
              .focus()
              .selectParentNode()
              .deleteSelection()
              .setCursorToPrevNodeEnd()
              .run()
          }

          // blockquote内の場合も同様にp要素の親要素を削除する
          if (editor.isActive("blockquote")) {
            return chain()
              .focus()
              .selectParentNode()
              .deleteSelection()
              .setCursorToPrevNodeEnd()
              .run()
          }

          // セクションブロック内の扱い
          if (editor.isActive(SECTION_BLOCK)) {
            const activeSection = findParentNodeClosestToPos(
              $from,
              (node) => node.type.name === SECTION_BLOCK
            )
            if (!activeSection) return false

            // 子が複数 → 現在のノードだけ削除
            if (activeSection.node.childCount > 1) {
              return chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
            }

            // 子が1つ → セクションブロックごと削除
            return chain().focus().deleteSectionBlock().setCursorToPrevNodeEnd().run()
          }

          // その他は何もしない
          return false
        }
    }
  }
})
