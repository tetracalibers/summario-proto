import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { ListKit } from "@tiptap/extension-list"
import type { Extensions, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Link } from "@mantine/tiptap"
import { CursorControl } from "./extensions/cursor-control/extension"
import { SectionBlockNode } from "./extensions/section-block/extension"
import { TitleBlockNode } from "./extensions/title-block/extension"
import Document from "@tiptap/extension-document"
import { all, createLowlight } from "lowlight"
import { Placeholder } from "@tiptap/extension-placeholder"
import { DirtyState } from "./extensions/dirty-state/extension"
import { DropSectionBlock } from "./extensions/drop-section-block/extension"
import { CustomDocumentControl } from "./extensions/doc-control/extension"
import { TitleWatcher } from "./extensions/title-watcher/extension"

const CustomDocument = Document.extend({
  content: "title (section|block)*"
})

const lowlight = createLowlight(all)

export interface EditorActionHooks {
  onDirtyChange?: (dirty: boolean) => void
  onTitleChange?: (title: string | null) => void
}

export const tiptapExtensions = (
  initialJSON?: JSONContent,
  { onDirtyChange, onTitleChange }: EditorActionHooks = {}
): Extensions => [
  CustomDocument,
  CustomDocumentControl,
  CursorControl,
  DirtyState.configure({ initialJSON, onDirtyChange }),
  TitleWatcher.configure({ onTitleChange }),
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
    // 末尾にdropした際に空の段落も合わせて追加されるのを防ぐ
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
  SectionBlockNode,
  TitleBlockNode,
  DropSectionBlock,
  Placeholder.configure({
    showOnlyCurrent: false,
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === "title_block") return "Title*"
      if (node.type.name === "heading") {
        return "Heading " + node.attrs.level
      }
      return "..."
    }
  })
]
