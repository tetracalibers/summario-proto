import { useEditor, type JSONContent } from "@tiptap/react"
import { tiptapExtensions } from "../../libs/editor/extensions"

export const useTiptapEditor = (
  initialJSON?: JSONContent,
  onDirtyChange?: (dirty: boolean) => void
) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false, // Disable immediate rendering to prevent SSR issues
    extensions: tiptapExtensions(initialJSON, onDirtyChange),
    content: initialJSON
  })

  return editor
}
