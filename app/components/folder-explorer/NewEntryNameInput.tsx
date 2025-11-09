import { TextInput } from "@mantine/core"
import { IconFolderFilled, IconNote } from "@tabler/icons-react"
import { Form, Link } from "react-router"
import { getHotkeyHandler } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import notificationStyle from "./notification.module.css"
import IconLoadingSpinner from "~/components/icon-loading-spinner/IconLoadingSpinner"
import type { EntryType } from "~/usecases/folder-explorer/types"
import { useNewEntryCreateUi } from "~/usecases/folder-explorer/input/ui.hooks"

interface Props {
  type: EntryType
}

function IconEntry({ type }: Pick<Props, "type">) {
  return type === "folder" ? <IconFolderFilled size={18} /> : <IconNote size={18} />
}

export default function NewEntryNameInput({ type }: Props) {
  const { save, isSaving, setName, error, resetAndHideInput } = useNewEntryCreateUi()

  return (
    <Form
      onSubmit={() => {
        save(type, {
          onSuccess: ({ id, name }) => {
            notifications.show({
              title: "SUCCESS",
              message:
                type === "folder" ? (
                  <>フォルダ「{name}」が新規作成されました 🎉</>
                ) : (
                  <>
                    <Link
                      to={`/terms/${id}`}
                      style={{
                        textDecorationColor: "var(--mantine-color-indigo-5)",
                        color: "var(--mantine-color-indigo-6)"
                      }}
                    >
                      {name}
                    </Link>
                    が新規作成されました 🎉
                  </>
                ),
              color: "cyan",
              classNames: notificationStyle,
              autoClose: false
            })
          },
          onError: ({ detail }) => {
            notifications.show({
              title: detail.title,
              message: detail.message,
              color: "pink",
              classNames: notificationStyle,
              autoClose: false
            })
          }
        })
      }}
    >
      <TextInput
        placeholder={`New ${type === "folder" ? "Folder" : "File"} Name`}
        aria-label={`new ${type === "folder" ? "folder" : "file"} name`}
        autoFocus
        leftSection={isSaving ? <IconLoadingSpinner size={16} /> : <IconEntry type={type} />}
        styles={{
          section: { "--section-size": "18px", "--section-start": "4px" },
          input: {
            "--input-fz": "0.8rem",
            "--input-padding-inline-start": "calc(18px + 4px * 2)",
            "--input-height": "calc(18px + 4px * 2)",
            "--input-size": "calc(18px + 4px * 2)"
          }
        }}
        onChange={(e) => setName(e.currentTarget.value)}
        disabled={isSaving}
        onBlur={resetAndHideInput}
        onKeyDown={getHotkeyHandler([["Escape", resetAndHideInput]])}
        error={error}
      />
    </Form>
  )
}
