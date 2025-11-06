import { RichTextEditor } from "@mantine/tiptap"
import DragHandle from "@tiptap/extension-drag-handle-react"
import EditorActionbar from "./Actionbar"
import { type Editor } from "@tiptap/react"

interface Props {
  editor: Editor | null
}

const TipTapEditor = ({ editor }: Props) => {
  return (
    <RichTextEditor editor={editor} mih="100%" bd={0}>
      <DragHandle editor={editor!}>
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
      <RichTextEditor.Content mih="100%" bdrs={0} />
      <EditorActionbar editor={editor} />
    </RichTextEditor>
  )
}

export default TipTapEditor
