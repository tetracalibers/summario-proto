import { useMemo, type PropsWithChildren } from "react"
import { useTiptapEditor } from "./use-tiptap-editor"
import { EditorContext, type Content } from "@tiptap/react"
import TipTapEditor from "./Editor"

interface Props {
  initialContent?: Content
}

const EditorWith = ({ children, initialContent }: PropsWithChildren<Props>) => {
  const editor = useTiptapEditor(initialContent)
  const editorValue = useMemo(() => ({ editor }), [editor])

  return (
    <EditorContext.Provider value={editorValue}>
      {children}
      <div className="editor-area">
        <TipTapEditor editor={editor} />
      </div>
    </EditorContext.Provider>
  )
}

export default EditorWith
