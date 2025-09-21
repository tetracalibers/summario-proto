import "~/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "~/components/tiptap-node/list-node/list-node.scss"
import "~/components/tiptap-node/heading-node/heading-node.scss"
import "~/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "~/components/tiptap-node/code-block-node/code-block-node.scss"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { all, createLowlight } from "lowlight"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import EditorMenu from "./Menu"
import EditorActionbar from "./Actionbar"
import { ListKit } from "@tiptap/extension-list"
import SectionBlock from "~/extensions/section-block/extension"
import DragHandle from "@tiptap/extension-drag-handle-react"

const lowlight = createLowlight(all)

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ListKit,
      CodeBlockLowlight.configure({
        lowlight
      }),
      SectionBlock
    ],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>
    <section-block>
      <p>This is section.</p>
    </section-block>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `
  })

  return (
    <div>
      <EditorActionbar editor={editor} />
      <EditorMenu editor={editor} />
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
