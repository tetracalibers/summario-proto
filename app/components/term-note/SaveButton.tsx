import { Button } from "@mantine/core"
import { useCurrentEditor } from "@tiptap/react"
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
import { notifications } from "@mantine/notifications"
import reversedNotificationStyles from "./reversed-notification.module.css"
import { dirtyEditorAtom } from "../editor/atoms"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const fetcher = useFetcher<typeof action>()

  const { editor } = useCurrentEditor()

  const isDirtyAlias = useAtomValue(dirtyAliasAtom)
  const isDirtyRelated = useAtomValue(dirtyRelatedAtom)
  const isDirtyEditor = useAtomValue(dirtyEditorAtom)

  const resetAliasDiff = useSetAtom(resetAliasDiffAtom)
  const resetRelatedDiff = useSetAtom(resetRelatedDiffAtom)

  const createSavePayload = useAtomCallback(
    useCallback(
      (get) => {
        if (!editor) return null

        const aliasDiff = get(aliasSavePayloadAtom)
        const relatedDiff = get(relatedSavePayloadAtom)

        if (!isDirtyEditor) {
          return { alias: aliasDiff, related: relatedDiff }
        }

        const content = editor.getJSON()
        return { content, alias: aliasDiff, related: relatedDiff }
      },
      [editor, isDirtyEditor]
    )
  )

  // ボタン押下後、保存が成功したら
  useEffect(() => {
    if (!editor) return
    if (!fetcher.data) return
    if (!fetcher.data.ok) return

    resetAliasDiff(fetcher.data.alias.created, fetcher.data.alias.deleted)
    resetRelatedDiff(fetcher.data.related.created, fetcher.data.related.deleted)

    // 保存開始時から未変更なら未編集化
    const cleaned = editor.commands.markCleanIfUnmodified()

    const notificationOption = cleaned
      ? { title: "Success", message: "保存に成功しました 🎉", color: "cyan" }
      : {
          title: "Warning",
          message: "保存中に編集されました。もう一度保存してください。",
          color: "yellow"
        }
    notifications.show(notificationOption)
  }, [fetcher.data, editor])

  // エラー発生時
  useEffect(() => {
    if (!fetcher.data) return
    if (fetcher.data.ok) return

    fetcher.data.errors.forEach((error) => {
      notifications.show({
        title: error.title,
        message: error.message,
        color: "pink",
        classNames: reversedNotificationStyles,
        autoClose: false
      })
    })
  }, [fetcher.data])

  return (
    <Button
      style={{ display: "grid", width: "100%" }}
      variant="gradient"
      gradient={{ from: "grape", to: "indigo", deg: 90 }}
      radius="sm"
      disabled={[isDirtyEditor, isDirtyAlias, isDirtyRelated].every((isDirty) => !isDirty)}
      onClick={() => {
        if (!editor) return

        const payload = createSavePayload()
        if (!payload) return

        // 保存開始時のdocをスナップショット
        editor.commands.takeSnapshot()

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
