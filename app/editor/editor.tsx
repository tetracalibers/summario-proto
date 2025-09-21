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

const lowlight = createLowlight(all)

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight
      })
    ], // define your extension array
    content: "<p>Hello World!</p>" // initial content
  })

  return (
    <div>
      <EditorActionbar editor={editor} />
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
