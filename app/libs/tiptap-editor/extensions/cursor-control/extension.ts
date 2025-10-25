import { Extension } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cursorControl: {
      setCursorToPrevNodeEnd: (textOffset?: number) => ReturnType
    }
  }
}

export const CursorControl = Extension.create({
  name: "cursor-control",

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
        }
    }
  }
})
