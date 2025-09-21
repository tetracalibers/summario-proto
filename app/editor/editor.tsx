// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import "~/components/tiptap-node/paragraph-node/paragraph-node.scss"

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: "<p>Hello World!</p>" // initial content
  })

  return (
    <>
      <EditorContent editor={editor} />
    </>
  )
}

export default TiptapEditor
