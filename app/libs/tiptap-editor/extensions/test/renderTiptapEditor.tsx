import {
  EditorContent,
  Extension,
  Node,
  useEditor,
  type Editor,
  type JSONContent
} from "@tiptap/react"
import { expect, vi } from "vitest"
import { render, waitFor, type RenderResult } from "@testing-library/react"

interface RenderTiptapEditorProps {
  content: JSONContent | string
  extensions: (Extension | Node)[]
  setUpEditor: (editor: Editor) => void
}

// エディターを任意のコンテンツとExtensionで初期化してブラウザ上に展開
// ブラウザ上への展開は@testing-library/reactのrenderで行う
export async function renderTiptapEditor({
  content,
  extensions,
  setUpEditor
}: RenderTiptapEditorProps): Promise<RenderResult & { editor: Editor }> {
  let editorInstance: Editor | null = null
  const waitForEditorSetupComplete = vi.fn()

  const editorOperation = (editor: Editor) => {
    editorInstance = editor
    setUpEditor(editor)
    waitForEditorSetupComplete()
  }

  const renderResult = render(
    <TiptapEditor content={content} extensions={extensions} setUpEditor={editorOperation} />
  )

  // render 実行後、editorのカーソル操作などを行う setUpEditor の実行完了を待つ
  await waitFor(() => {
    expect(waitForEditorSetupComplete).toHaveBeenCalled()
  })

  if (!editorInstance) {
    throw new Error("Editor was not instantiated.")
  }

  return { ...renderResult, editor: editorInstance }
}

function TiptapEditor({ content, extensions, setUpEditor }: RenderTiptapEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    onCreate({ editor }) {
      setUpEditor(editor)
    }
  })

  if (editor === null) {
    return null
  }

  return <EditorContent editor={editor} id="editor" />
}
