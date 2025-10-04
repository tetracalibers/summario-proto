import { Button } from "@mantine/core"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useAtomValue } from "jotai"
import { useCallback, useEffect, type ButtonHTMLAttributes } from "react"
import { useFetcher, useParams } from "react-router"
import { aliasSavePayloadAtom, dirtyAliasAtom } from "../alias-input/atoms"
import { dirtyRelatedAtom, relatedSavePayloadAtom } from "../related-input/atoms"
import { useAtomCallback } from "jotai/utils"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const fetcher = useFetcher()
  const isSuccess = fetcher.state === "idle" && !!fetcher.data

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

  const createSavePayload = useAtomCallback(
    useCallback(
      async (get) => {
        if (!editor) return null
        const content: any = editor.getJSON()
        const aliasDiff = get(aliasSavePayloadAtom)
        const relatedDiff = get(relatedSavePayloadAtom)
        return { content, alias: aliasDiff, related: relatedDiff }
      },
      [editor]
    )
  )

  return (
    <Button
      style={{ display: "grid", width: "100%" }}
      variant="gradient"
      gradient={{ from: "grape", to: "indigo", deg: 90 }}
      radius="sm"
      disabled={
        !isSuccess &&
        [editorState?.isDirty, isDirtyAlias, isDirtyRelated].every((isDirty) => !isDirty)
      }
      onClick={async () => {
        const payload = await createSavePayload()
        if (!payload) return
        fetcher.submit(payload, {
          method: "post",
          action: `/api/save/${termId}`,
          encType: "application/json"
        })
      }}
      {...props}
    >
      Save
    </Button>
  )
}

export default SaveButton
