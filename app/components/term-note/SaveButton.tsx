import { Button } from "@mantine/core"
import { useCurrentEditor } from "@tiptap/react"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, type ButtonHTMLAttributes } from "react"
import { useFetcher, useParams } from "react-router"
import { setServerAliasAtom } from "../alias-input/atoms"
import { setServerRelatedAtom } from "../related-input/atoms"
import type { action } from "~/routes/api/save"
import { notifications } from "@mantine/notifications"
import reversedNotificationStyles from "./reversed-notification.module.css"
import { canSaveAtom, saveMetaPayloadAtom, savingStateAtom } from "./atoms"
import { dirtyEditorAtom } from "../editor/atoms"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const fetcher = useFetcher<typeof action>()

  const { editor } = useCurrentEditor()

  const canSave = useAtomValue(canSaveAtom)
  const setSavingState = useSetAtom(savingStateAtom)

  const setServerAlias = useSetAtom(setServerAliasAtom)
  const setServerRelated = useSetAtom(setServerRelatedAtom)

  const saveMetaPayload = useAtomValue(saveMetaPayloadAtom)
  const isDirtyEditor = useAtomValue(dirtyEditorAtom)

  useEffect(() => {
    setSavingState(fetcher.state)
  }, [fetcher.state])

  // ボタン押下後、保存が成功したら
  useEffect(() => {
    if (!editor) return
    if (!fetcher.data) return
    if (!fetcher.data.ok) return

    setServerAlias(fetcher.data.alias.created, fetcher.data.alias.deleted)
    setServerRelated(fetcher.data.related.created, fetcher.data.related.deleted)

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
      disabled={!canSave}
      onClick={() => {
        if (!editor) return

        // 保存開始時のdocをスナップショット
        editor.commands.takeSnapshot()

        const payload = {
          ...saveMetaPayload,
          content: isDirtyEditor ? editor.getJSON() : null
        }

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
