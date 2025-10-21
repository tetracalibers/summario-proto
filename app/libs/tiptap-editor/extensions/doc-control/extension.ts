import { Extension } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      clearTitleContent: () => ReturnType
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
        }
    }
  }
})
