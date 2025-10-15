import { IconFolderFilled, IconTrash, IconEdit } from "@tabler/icons-react"
import { Menu, UnstyledButton } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"
import { useState } from "react"

interface Props {
  folderName: string
  isActiveStyle: boolean
  onClick: () => void
}

export default function FolderLink({ folderName, isActiveStyle, onClick }: Props) {
  const [openedMenu, setOpenedMenu] = useState(false)

  return (
    <Menu
      shadow="md"
      offset={0}
      width={200}
      position="right-start"
      withArrow
      arrowPosition="center"
      opened={openedMenu}
      onChange={setOpenedMenu}
    >
      <Menu.Target aria-label="folder action menu">
        <UnstyledButton
          onClick={onClick}
          onContextMenu={(e) => {
            e.preventDefault()
            setOpenedMenu(true)
          }}
          className={clsx(
            styles.entry_link,
            styles.folder_link,
            isActiveStyle && styles.highlight_active,
            openedMenu && styles.highlight_focused
          )}
        >
          <IconFolderFilled size={18} />
          <span className={styles.label}>{folderName}</span>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEdit size={14} />}>Rename</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
