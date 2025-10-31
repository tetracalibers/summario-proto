import { useMemo, type PropsWithChildren } from "react"
import { useTiptapEditor } from "./use-tiptap-editor"
import { EditorContext, type JSONContent } from "@tiptap/react"
import TipTapEditor from "./Editor"
import { useSyncTermTitle, useTermContentState } from "~/units/term/ui.hooks"
import ScrollArea from "../scroll-area/ScrollArea"

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
      <ScrollArea className="editor-area">
        <TipTapEditor editor={editor} />
      </ScrollArea>
    </EditorContext.Provider>
  )
}

export default EditorWith
