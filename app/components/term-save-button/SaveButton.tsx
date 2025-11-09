import { Button } from "@mantine/core"
import { useCurrentEditor } from "@tiptap/react"
import { type ButtonHTMLAttributes } from "react"
import { useParams } from "react-router"
import { notifications } from "@mantine/notifications"
import loadingStyle from "./loading.module.css"
import { useTermContentSaveUi } from "~/usecases/term-edit/ui.hooks"
import IconLoadingSpinner from "../icon-loading-spinner/IconLoadingSpinner"
import { errorContent, successContent, warningContent } from "~/libs/mantine-notifications/options"

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

            const content = cleaned
              ? successContent("保存に成功しました 🎉")
              : warningContent("保存中に編集されました。もう一度保存してください。")

            notifications.show(content)
          },
          onError: ({ details }) => {
            details.forEach((error) => {
              notifications.show(errorContent(error.message, error.target))
            })
          }
        })
      }}
      {...props}
    >
      {isSaving ? (
        <span className={loadingStyle.loading}>
          <IconLoadingSpinner size="16px" />
          Saving...
        </span>
      ) : (
        "Save"
      )}
    </Button>
  )
}

export default SaveButton
