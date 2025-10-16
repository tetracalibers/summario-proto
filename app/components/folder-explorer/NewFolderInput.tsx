import { TextInput } from "@mantine/core"
import { IconFolderFilled } from "@tabler/icons-react"
import { useSetAtom } from "jotai"
import { Form } from "react-router"
import { resetEntryInputAtom } from "./atoms"
import { getHotkeyHandler } from "@mantine/hooks"

export default function NewFolderInput() {
  const hideAndReset = useSetAtom(resetEntryInputAtom)

  return (
    <Form>
      <TextInput
        placeholder="New Folder Name"
        aria-label="new folder name"
        autoFocus
        leftSection={<IconFolderFilled size={18} />}
        styles={{
          section: { "--section-size": "18px", "--section-start": "4px" },
          input: {
            "--input-fz": "0.8rem",
            "--input-padding-inline-start": "calc(18px + 4px * 2)",
            "--input-height": "calc(18px + 4px * 2)",
            "--input-size": "calc(18px + 4px * 2)"
          }
        }}
        onBlur={hideAndReset}
        onKeyDown={getHotkeyHandler([["Escape", hideAndReset]])}
      />
    </Form>
  )
}
