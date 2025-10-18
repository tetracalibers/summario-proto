import { useMemo, type PropsWithChildren } from "react"
import { useTiptapEditor } from "./use-tiptap-editor"
import { EditorContext, type JSONContent } from "@tiptap/react"
import TipTapEditor from "./Editor"
import { useTermContentEditUi } from "~/domains/term/ui.actions"

interface Props {
  initialJSON?: JSONContent
}

const EditorWith = ({ children, initialJSON }: PropsWithChildren<Props>) => {
  const { setIsDirty } = useTermContentEditUi()

  const editor = useTiptapEditor(initialJSON, setIsDirty)
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
