import "~/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "~/components/tiptap-node/list-node/list-node.scss"
import "~/components/tiptap-node/heading-node/heading-node.scss"
import "~/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "~/components/tiptap-node/code-block-node/code-block-node.scss"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { all, createLowlight } from "lowlight"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import EditorActionbar from "./Actionbar"
import { ListKit } from "@tiptap/extension-list"
import SectionBlock from "~/extensions/section-block/extension"
import DragHandle from "@tiptap/extension-drag-handle-react"
import { Link } from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extensions"
import TitleBlock from "~/extensions/title-block/extension"
import Document from "@tiptap/extension-document"

const CustomDocument = Document.extend({
  content: "title_block block*"
})

const lowlight = createLowlight(all)

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
        heading: {
          levels: [2, 3, 4]
        }
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
    ],
    content: `
    <title-block></title-block>
    <p></p>
    <section-block type="summary">
      <h2>Summary</h2>
      <p></p>
    </section-block>
    <section-block>
      <h2>Context</h2>
      <p></p>
    </section-block>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `
  })

  return (
    <div>
      <EditorActionbar editor={editor} />
      <DragHandle editor={editor}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </DragHandle>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
