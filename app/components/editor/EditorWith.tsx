import { useMemo, type PropsWithChildren } from "react"
import { useTiptapEditor } from "./use-tiptap-editor"
import { EditorContext, type JSONContent } from "@tiptap/react"
import TipTapEditor from "./Editor"
import { useTermContentState } from "~/units/term/ui.hooks"
import { useSyncTermTitle } from "~/usecases/sync-term-title/ui.hooks"

interface Props {
  title: string
  initialJSON?: JSONContent
}

const EditorWith = ({ children, initialJSON, title }: PropsWithChildren<Props>) => {
  const { setIsDirty } = useTermContentState()
  const { setTermTitle } = useSyncTermTitle(title)

  const editor = useTiptapEditor(initialJSON, {
    onDirtyChange: setIsDirty,
    onTitleChange: setTermTitle
  })
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
