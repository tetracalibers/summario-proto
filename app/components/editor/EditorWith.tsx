import { useMemo, type PropsWithChildren } from "react"
import { useTiptapEditor } from "./use-tiptap-editor"
import { EditorContext } from "@tiptap/react"
import TipTapEditor from "./Editor"
import styles from "./EditorWith.module.css"

interface Props {
  initialContent: string
}

const EditorWith = ({ children, initialContent }: PropsWithChildren<Props>) => {
  const editor = useTiptapEditor(initialContent)
  const editorValue = useMemo(() => ({ editor }), [editor])

  return (
    <EditorContext.Provider value={editorValue}>
      <div className={styles.header}>{children}</div>
      <div className={styles.editor}>
        <TipTapEditor editor={editor} />
      </div>
    </EditorContext.Provider>
  )
}

export default EditorWith
