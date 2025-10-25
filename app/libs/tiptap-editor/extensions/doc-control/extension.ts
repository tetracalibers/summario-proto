import { Extension, findParentNodeClosestToPos } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"

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
          // テキストの途中であれば何もしない
          if (textOffset > 0) return true

          const { $from } = state.selection
          const pos = $from.before()
          if (pos < 1) return true // ドキュメントの最初のノードでは何もしない
          const prevPos = state.doc.resolve(pos - 1)

          const isLastNode = $from.parentOffset === $from.parent.nodeSize - 2 // ノード末尾にいるかどうか
          const isCaretAtEnd = $from.pos === $from.end()

          if (isLastNode && isCaretAtEnd) {
            return chain().setTextSelection(TextSelection.atEnd(state.doc)).run()
          }

          if (isCaretAtEnd) {
            return chain().setTextSelection(TextSelection.atEnd(prevPos.node())).run()
          }

          // setTextSelectionコマンドを使用するとカーソルの位置を設定できる
          return chain().setTextSelection(TextSelection.near(prevPos, -1)).run()
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
          if (activeNode.type.name === "title_block") {
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

          if (editor.isActive("section_block")) {
            const activeSectionBlock = findParentNodeClosestToPos(
              activeNodePos,
              (node) => node.type.name === "section_block"
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
