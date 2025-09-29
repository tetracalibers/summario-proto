import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { ListKit } from "@tiptap/extension-list"
import type { Extensions } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Link } from "@mantine/tiptap"
import { CursorControl } from "~/extensions/cursor-control/extension"
import SectionBlock from "~/extensions/section-block/extension"
import TitleBlock from "~/extensions/title-block/extension"
import Document from "@tiptap/extension-document"
import { all, createLowlight } from "lowlight"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Extension } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDocumentControl: {
      clearTitleContent: () => ReturnType
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
        }
    }
  }
})

const CustomDocument = Document.extend({
  content: "title_block (section|block)*"
})

const lowlight = createLowlight(all)

export const tiptapExtensions: Extensions = [
  CustomDocument,
  CustomDocumentControl,
  CursorControl,
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
    underline: false
  }),
  ListKit,
  CodeBlockLowlight.configure({
    lowlight
  }),
  Link.configure({ openOnClick: false }),
  SectionBlock,
  TitleBlock,
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
