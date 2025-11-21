import { useEditor } from "@tiptap/react"
import { tiptapExtensions, type EditorActionHooks } from "~/libs/tiptap-editor/extensions"
import { createEditorJson, type EditorData } from "~/libs/tiptap-editor/utils"

export const useTiptapEditor = (initialData: EditorData, actions?: EditorActionHooks) => {
  const initialJSON = createEditorJson(initialData)

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false, // Disable immediate rendering to prevent SSR issues
    extensions: tiptapExtensions({ initialJSON, aliases: initialData.aliases }, actions),
    content: initialJSON
  })

  return editor
}
