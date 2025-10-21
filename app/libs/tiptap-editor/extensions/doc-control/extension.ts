import { Extension, findParentNodeClosestToPos } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      clearTitleContent: () => ReturnType
      deleteBlock: () => ReturnType
    }
  }
}

export const CustomDocumentControl = Extension.create({
  name: "custom-doc-control",

  addCommands() {
    return {
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
            return chain().focus().deleteNode(activeNode.type.name).run()
          }

          // リスト内の場合、リストアイテムごと削除
          // activeNodeはparagraphになっているが、その親であるli:has(> p)要素を削除する
          if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
            return chain().focus().selectParentNode().deleteSelection().run()
          }

          // blockquoteの場合も同様にp要素の親要素を削除する
          if (editor.isActive("blockquote")) {
            return chain().focus().selectParentNode().deleteSelection().run()
          }

          if (editor.isActive("section_block")) {
            const activeSectionBlock = findParentNodeClosestToPos(
              activeNodePos,
              (node) => node.type.name === "section_block"
            )
            if (!activeSectionBlock) return true

            // 子が複数ある場合は現在のノードだけ削除
            if (activeSectionBlock.node.childCount > 1) {
              return chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
            }

            // 子が1つだけの場合はセクションブロックごと削除
            return chain().focus().deleteSectionBlock().run()
          }

          return true
        }
    }
  }
})
