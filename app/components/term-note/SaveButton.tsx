import { Button } from "@mantine/core"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, type ButtonHTMLAttributes } from "react"
import { useFetcher, useParams } from "react-router"
import { aliasSavePayloadAtom, dirtyAliasAtom, resetAliasDiffAtom } from "../alias-input/atoms"
import {
  dirtyRelatedAtom,
  relatedSavePayloadAtom,
  resetRelatedDiffAtom
} from "../related-input/atoms"
import { useAtomCallback } from "jotai/utils"
import type { action } from "~/routes/api/save"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void
}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const fetcher = useFetcher<typeof action>()

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

  const resetAliasDiff = useSetAtom(resetAliasDiffAtom)
  const resetRelatedDiff = useSetAtom(resetRelatedDiffAtom)

  const createSavePayload = useAtomCallback(
    useCallback(
      async (get) => {
        if (!editor) return null
        if (!editorState) return null

        const aliasDiff = get(aliasSavePayloadAtom)
        const relatedDiff = get(relatedSavePayloadAtom)

        if (!editorState.isDirty) {
          return { alias: aliasDiff, related: relatedDiff }
        }

        const content = editor.getJSON()
        return { content, alias: aliasDiff, related: relatedDiff }
      },
      [editor, editorState]
    )
  )

  // ボタン押下後、保存が成功したら各種dirtyフラグをリセット
  useEffect(() => {
    if (!editor) return
    if (!fetcher.data) return
    if (!fetcher.data.ok) return

    resetAliasDiff(fetcher.data.alias.created, fetcher.data.alias.deleted)
    resetRelatedDiff(fetcher.data.related.created, fetcher.data.related.deleted)

    editor.commands.clearHistory()
  }, [fetcher.data, editor])

  return (
    <Button
      style={{ display: "grid", width: "100%" }}
      variant="gradient"
      gradient={{ from: "grape", to: "indigo", deg: 90 }}
      radius="sm"
      disabled={[editorState?.isDirty, isDirtyAlias, isDirtyRelated].every((isDirty) => !isDirty)}
      onClick={async () => {
        const payload = await createSavePayload()
        if (!payload) return
        fetcher.submit(payload as any, {
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
