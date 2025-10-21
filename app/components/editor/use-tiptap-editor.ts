import { useEditor, type JSONContent } from "@tiptap/react"
import { tiptapExtensions, type EditorActionHooks } from "~/libs/tiptap-editor/extensions"

export const useTiptapEditor = (initialJSON?: JSONContent, actions?: EditorActionHooks) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false, // Disable immediate rendering to prevent SSR issues
    extensions: tiptapExtensions(initialJSON, actions),
    content: initialJSON
  })

  return editor
}
