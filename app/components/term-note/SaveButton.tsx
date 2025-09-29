import { Button } from "@mantine/core"
import { Editor, useEditorState } from "@tiptap/react"
import type { ButtonHTMLAttributes } from "react"
import { Form } from "react-router"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  editor: Editor | null
}

const SaveButton = ({ editor, ...props }: Props) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null
      return {
        isDirty: editor.can().undo()
      }
    }
  })
  if (!editorState) return null

  return (
    <Form method="post">
      <Button
        type="submit"
        variant="gradient"
        gradient={{ from: "grape", to: "indigo", deg: 90 }}
        radius="sm"
        disabled={!editorState.isDirty}
        {...props}
      >
        Save
      </Button>
    </Form>
  )
}

export default SaveButton
