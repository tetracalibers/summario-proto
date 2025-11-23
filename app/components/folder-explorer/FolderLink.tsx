import { IconFolderFilled, IconLogin2 } from "@tabler/icons-react"
import { Button, Menu, UnstyledButton } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"
import EntryCheckbox from "./EntryCheckbox"
import MenuItemForDelete from "./folder-context-menu/MenuItemForDelete"
import { useState } from "react"
import MenuItemForMove from "./folder-context-menu/MenuItemForMove"
import MenuItemForRename from "./folder-context-menu/MenuItemForRename"
import {
  useCheckFolderToMoveUi,
  useMovingTargetFolderUi
} from "~/usecases/folder-explorer/move-to-folder/ui.hooks"

interface Props {
  folder: { id: number; name: string }
  folderEntryCount: number
  isActiveStyle: boolean
  onLinkClick: () => void
  selectable: boolean
}

export default function FolderLink({
  folder,
  folderEntryCount,
  isActiveStyle,
  onLinkClick,
  selectable
}: Props) {
  const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false)
  const { destinationFolderId, setDestinationFolderId } = useMovingTargetFolderUi()
  const { updateCheckedFolder } = useCheckFolderToMoveUi()
  const isEmpty = folderEntryCount === 0

  return selectable ? (
    <div className={clsx(styles.entry_link, styles.folder_link, styles.selectable)}>
      <IconFolderFilled size={18} className={styles.entry_icon} />
      <span className={styles.label}>{folder.name}</span>
      {destinationFolderId === folder.id ? (
        <Button
          variant="light"
          color="pink"
          size="compact-xs"
          radius="sm"
          leftSection={<IconLogin2 size={14} />}
          styles={{
            inner: { gap: 4 },
            section: { margin: 0 },
            label: { fontSize: "0.7rem" }
          }}
        >
          Move Here
        </Button>
      ) : (
        <EntryCheckbox type="folder" onChange={() => updateCheckedFolder(folder.id)} />
      )}
    </div>
  ) : (
    <Menu
      shadow="md"
      offset={0}
      width={200}
      position="right-start"
      withArrow
      arrowPosition="center"
      opened={isOpenedContextMenu}
      onChange={setIsOpenedContextMenu}
      styles={{
        arrow: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" },
        dropdown: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" },
        itemLabel: { fontSize: "var(--mantine-font-size-xs)" }
      }}
    >
      <Menu.Target aria-label="folder action menu">
        <UnstyledButton
          onClick={onLinkClick}
          onContextMenu={(e) => {
            e.preventDefault()
            setIsOpenedContextMenu(true)
          }}
          className={clsx(
            styles.entry_link,
            styles.folder_link,
            isActiveStyle && styles.highlight_active,
            isOpenedContextMenu && styles.highlight_focused
          )}
        >
          <IconFolderFilled size={18} className={styles.entry_icon} />
          <span className={styles.label}>{folder.name}</span>
          <span className={styles.count}>{folderEntryCount}</span>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <MenuItemForRename />
        <MenuItemForMove
          folderId={folder.id}
          closeMenu={() => setIsOpenedContextMenu(false)}
          setDestinationFolderId={setDestinationFolderId}
        />
        <Menu.Divider />
        <MenuItemForDelete
          isEmpty={isEmpty}
          folder={folder}
          closeMenu={() => setIsOpenedContextMenu(false)}
        />
      </Menu.Dropdown>
    </Menu>
  )
}
