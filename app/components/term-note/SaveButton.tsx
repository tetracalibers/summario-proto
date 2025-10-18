import { Button } from "@mantine/core"
import { useCurrentEditor } from "@tiptap/react"
import { useEffect, type ButtonHTMLAttributes } from "react"
import { useFetcher, useParams } from "react-router"
import { notifications } from "@mantine/notifications"
import reversedNotificationStyles from "./reversed-notification.module.css"
import { IconLoader } from "@tabler/icons-react"
import loadingStyle from "./loading.module.css"
import type { action } from "~/routes/api/terms/edit"
import { useTermContentSaveUi } from "~/usecases/term-edit/ui.actions"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const fetcher = useFetcher<typeof action>()
  const isSubmitting = fetcher.state === "submitting"

  const { editor } = useCurrentEditor()

  const {
    termMetaDiff,
    isCanSave,
    isDirtyEditor,
    setIsSaving,
    applyServerAliasSnapshot,
    applyServerRelatedTermSnapshot
  } = useTermContentSaveUi()

  useEffect(() => {
    setIsSaving(fetcher.state === "submitting")
  }, [fetcher.state])

  // ボタン押下後、保存が成功したら
  useEffect(() => {
    if (!editor) return
    if (!fetcher.data) return
    if (!fetcher.data.ok) return

    applyServerAliasSnapshot(fetcher.data.alias.created, fetcher.data.alias.deleted)
    applyServerRelatedTermSnapshot(fetcher.data.related.created, fetcher.data.related.deleted)

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
      disabled={!isCanSave || isSubmitting}
      onClick={() => {
        if (!editor) return

        // 保存開始時のdocをスナップショット
        editor.commands.takeSnapshot()

        const payload = {
          ...termMetaDiff,
          content: isDirtyEditor ? editor.getJSON() : null
        }

        fetcher.submit(payload as any, {
          method: "post",
          action: `/api/terms/${termId}/edit`,
          encType: "application/json"
        })
      }}
      {...props}
    >
      {isSubmitting ? (
        <span className={loadingStyle.loading}>
          <IconLoader className={loadingStyle.loading_icon} size="16px" />
          Saving...
        </span>
      ) : (
        "Save"
      )}
    </Button>
  )
}

export default SaveButton
