import { Extension } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cursorControl: {
      setCursorToPrevNodeEnd: () => ReturnType
    }
  }
}

export const CursorControl = Extension.create({
  name: "cursor-control",

  addCommands() {
    return {
      setCursorToPrevNodeEnd:
        () =>
        ({ chain, state }) => {
          const { $from } = state.selection
          const pos = $from.before()
          const prevPos = state.doc.resolve(pos - 1)

          const isLastNode =
            state.doc.resolve(state.doc.content.size).nodeBefore === $from.node($from.depth - 1)
          if (isLastNode) {
            return chain().setTextSelection(TextSelection.atEnd(state.doc)).run()
          }

          return chain().setTextSelection(TextSelection.near(prevPos, -1)).run()
        }
    }
  }
})
