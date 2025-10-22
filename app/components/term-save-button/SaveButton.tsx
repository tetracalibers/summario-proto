import { Button } from "@mantine/core"
import { useCurrentEditor } from "@tiptap/react"
import { type ButtonHTMLAttributes } from "react"
import { useParams } from "react-router"
import { notifications } from "@mantine/notifications"
import reversedNotificationStyles from "./reversed-notification.module.css"
import { IconLoader } from "@tabler/icons-react"
import loadingStyle from "./loading.module.css"
import { useTermContentSaveUi } from "~/usecases/term-edit/ui.hooks"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SaveButton = (props: Props) => {
  const { termId } = useParams()
  const { editor } = useCurrentEditor()
  const { isCanSave, isDirtyEditor, save, isSaving } = useTermContentSaveUi(Number(termId))

  return (
    <Button
      style={{ display: "grid", width: "100%" }}
      variant="gradient"
      gradient={{ from: "grape", to: "indigo", deg: 90 }}
      radius="sm"
      disabled={!isCanSave || isSaving}
      onClick={() => {
        if (!editor) return

        // 保存開始時のdocをスナップショット
        editor.commands.takeSnapshot()
        const content = isDirtyEditor ? editor.getJSON() : null

        save(content, {
          onSuccess: () => {
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
          },
          onError: ({ details }) => {
            details.forEach((error) => {
              notifications.show({
                title: error.title,
                message: error.message,
                color: "pink",
                classNames: reversedNotificationStyles,
                autoClose: false
              })
            })
          }
        })
      }}
      {...props}
    >
      {isSaving ? (
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
