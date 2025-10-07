import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { ListKit } from "@tiptap/extension-list"
import type { Extensions, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Link } from "@mantine/tiptap"
import { CursorControl } from "~/extensions/cursor-control/extension"
import SectionBlock from "~/extensions/section-block/extension"
import TitleBlock from "~/extensions/title-block/extension"
import Document from "@tiptap/extension-document"
import { all, createLowlight } from "lowlight"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Extension } from "@tiptap/core"
import { EditorState } from "@tiptap/pm/state"
import { DirtyState } from "~/extensions/dirty-state/extension"
import { DropSectionBlock } from "~/extensions/drop-section-block/extension"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      clearTitleContent: () => ReturnType
      clearHistory: () => void
    }
  }
}

const CustomDocumentControl = Extension.create({
  name: "customDocumentControl",

  addCommands() {
    return {
      clearTitleContent:
        () =>
        ({ chain }) => {
          const titleLength = this.editor.state.doc.content.firstChild?.content.size || 0
          const range = { from: 1, to: titleLength + 1 }
          return chain().insertContentAt(range, "").run()
        },
      // ref: https://github.com/ueberdosis/tiptap/issues/491
      clearHistory: () => () => {
        const newEditorState = EditorState.create({
          doc: this.editor.state.doc,
          plugins: this.editor.state.plugins,
          schema: this.editor.state.schema
        })
        this.editor.view.updateState(newEditorState)
      }
    }
  }
})

const CustomDocument = Document.extend({
  content: "title_block (section|block)*"
})

const lowlight = createLowlight(all)

export const tiptapExtensions = (
  initialJSON?: JSONContent,
  onDirtyChange?: (dirty: boolean) => void
): Extensions => [
  CustomDocument,
  CustomDocumentControl,
  CursorControl,
  DirtyState.configure({ initialJSON, onDirtyChange }),
  StarterKit.configure({
    document: false, // CustomDocumentを使うので無効化
    link: false, // Link拡張を使うので無効化
    codeBlock: false, // CodeBlockLowlight拡張を使うので無効化
    // ListKit拡張を使うので無効化
    bulletList: false,
    orderedList: false,
    listItem: false,
    listKeymap: false,
    // 許容する構文の制御
    heading: {
      levels: [2, 3, 4]
    },
    italic: false,
    underline: false,
    // 最後に必ず空の段落が追加されるのを防ぐ
    trailingNode: false,
    // drop可能位置の線
    dropcursor: {
      color: "var(--mantine-color-magenta-3)",
      width: 2
    }
  }),
  ListKit,
  CodeBlockLowlight.configure({
    lowlight
  }),
  Link.configure({ openOnClick: false }),
  SectionBlock,
  TitleBlock,
  DropSectionBlock,
  Placeholder.configure({
    showOnlyCurrent: false,
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === "title_block") return "Title"
      if (node.type.name === "heading") {
        return "Heading " + node.attrs.level
      }
      return "..."
    }
  })
]
