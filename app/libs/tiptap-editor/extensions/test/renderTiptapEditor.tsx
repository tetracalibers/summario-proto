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

/*
  renderTiptapEditor はエディターを任意のコンテンツとExtensionで
  初期化してブラウザ上に展開します。
  エディターの初期化はTiptapのuseEditor、
  ブラウザ上への展開は@testing-library/reactのrenderで行います。
*/
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

  /* 
	render 実行後、editorのカーソル操作などを行う setUpEditor の実行完了を待ちます。
	これは setUpEditor でエディター初期化後にテストのためにエディター上で
	行いたい動作を行うまで待っています。
	具体例は後述しますが、初期化時に特定のポジションにカーソルを合わせる時などに使用します。
   */
  await waitFor(() => {
    expect(waitForEditorSetupComplete).toHaveBeenCalled()
  }) /* render の実行結果である renderResult をそのまま返します。*/

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
