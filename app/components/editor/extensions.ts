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

const CustomDocument = Document.extend({
  content: "title_block block*"
})

const lowlight = createLowlight(all)

export const tiptapExtensions: Extensions = [
  CustomDocument,
  CursorControl,
  StarterKit.configure({
    document: false,
    link: false,
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
