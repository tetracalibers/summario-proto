import { TextInput } from "@mantine/core"
import { IconNote } from "@tabler/icons-react"
import { Form, Link } from "react-router"
import { getHotkeyHandler } from "@mantine/hooks"
import { useEmptyTermCreateUi } from "~/usecases/folder-explorer/input/ui.hooks"
import { notifications } from "@mantine/notifications"
import notificationStyle from "./notification.module.css"
import reversedNotificationStyles from "../term-save-button/reversed-notification.module.css"
import IconLoadingSpinner from "~/components/icon-loading-spinner/IconLoadingSpinner"

interface Props {
  resetAndHideFn: () => void
}

export default function NewFileInput({ resetAndHideFn }: Props) {
  const { save, isSaving, setTitle, error } = useEmptyTermCreateUi()

  return (
    <Form
      onSubmit={() => {
        save({
          onSuccess: ({ id, title }) => {
            notifications.show({
              title: "Success",
              message: (
                <>
                  <Link
                    to={`/terms/${id}`}
                    style={{
                      textDecorationColor: "var(--mantine-color-indigo-5)",
                      color: "var(--mantine-color-indigo-6)"
                    }}
                  >
                    {title}
                  </Link>
                  が新規作成されました 🎉
                </>
              ),
              color: "cyan",
              classNames: notificationStyle
            })
          },
          onError: ({ detail }) => {
            notifications.show({
              title: detail.title,
              message: detail.message,
              color: "pink",
              classNames: reversedNotificationStyles,
              autoClose: false
            })
          }
        })
      }}
    >
      <TextInput
        placeholder="New File Name"
        aria-label="new file name"
        autoFocus
        leftSection={isSaving ? <IconLoadingSpinner size={16} /> : <IconNote size={18} />}
        styles={{
          section: { "--section-size": "18px", "--section-start": "4px" },
          input: {
            "--input-fz": "0.8rem",
            "--input-padding-inline-start": "calc(18px + 4px * 2)",
            "--input-height": "calc(18px + 4px * 2)",
            "--input-size": "calc(18px + 4px * 2)"
          }
        }}
        onChange={(e) => setTitle(e.currentTarget.value)}
        disabled={isSaving}
        onBlur={resetAndHideFn}
        onKeyDown={getHotkeyHandler([["Escape", resetAndHideFn]])}
        error={error}
      />
    </Form>
  )
}
