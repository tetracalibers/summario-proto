import type { Editor } from "@tiptap/react"
import { CodeBlockButton } from "~/components/tiptap-ui/code-block-button"

interface Props {
  editor: Editor
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <>
      <CodeBlockButton editor={editor} hideWhenUnavailable={true} showShortcut={true} />
    </>
  )
}

export default EditorActionbar
