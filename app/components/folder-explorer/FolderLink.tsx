import ItemContent from "./ItemContent"
import { IconFolderFilled } from "@tabler/icons-react"
import { UnstyledButton } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"

interface Props {
  folderName: string
  isActiveStyle: boolean
  onClick: () => void
}

export default function FolderLink({ folderName, isActiveStyle, onClick }: Props) {
  return (
    <UnstyledButton
      onClick={onClick}
      className={clsx(
        styles.entry_link,
        styles.folder_link,
        isActiveStyle && styles.highlight_active
      )}
    >
      <ItemContent label={folderName} Icon={() => <IconFolderFilled size={18} />} />
    </UnstyledButton>
  )
}
