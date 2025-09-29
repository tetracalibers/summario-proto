import { Button } from "@mantine/core"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import type { ButtonHTMLAttributes } from "react"
import { Form } from "react-router"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { editor } = useCurrentEditor()
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null
      return {
        isDirty: editor.can().undo()
      }
    }
  })
  return (
    <Form method="post" style={{ display: "grid" }}>
      <Button
        type="submit"
        variant="gradient"
        gradient={{ from: "grape", to: "indigo", deg: 90 }}
        radius="sm"
        disabled={!editorState?.isDirty}
        {...props}
      >
        Save
      </Button>
    </Form>
  )
}

export default SaveButton
