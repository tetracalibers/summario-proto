import { Button } from "@mantine/core"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useAtomValue } from "jotai"
import type { ButtonHTMLAttributes } from "react"
import { Form } from "react-router"
import { dirtyAliasAtom } from "../alias-input/atoms"
import { dirtyRelatedAtom } from "../related-input/atoms"

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

  const isDirtyAlias = useAtomValue(dirtyAliasAtom)
  const isDirtyRelated = useAtomValue(dirtyRelatedAtom)

  return (
    <Form method="post" style={{ display: "grid" }}>
      <Button
        type="submit"
        variant="gradient"
        gradient={{ from: "grape", to: "indigo", deg: 90 }}
        radius="sm"
        disabled={[editorState?.isDirty, isDirtyAlias, isDirtyRelated].every((isDirty) => !isDirty)}
        {...props}
      >
        Save
      </Button>
    </Form>
  )
}

export default SaveButton
