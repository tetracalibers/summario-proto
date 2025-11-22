import { IconFolderFilled } from "@tabler/icons-react"
import { Menu, UnstyledButton } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"
import EntryCheckbox from "./EntryCheckbox"
import type { Entry } from "~/usecases/folder-explorer/types"
import MenuItemForDelete from "./folder-context-menu/MenuItemForDelete"
import { useState } from "react"
import MenuItemForMove from "./folder-context-menu/MenuItemForMove"
import MenuItemForRename from "./folder-context-menu/MenuItemForRename"

interface Props {
  folder: { id: number; name: string }
  folderEntryCount: number
  isActiveStyle: boolean
  onLinkClick: () => void
  selectable: boolean
  updateSelection: (entry: Entry, selected: boolean) => void
}

export default function FolderLink({
  folder,
  folderEntryCount,
  isActiveStyle,
  onLinkClick,
  selectable,
  updateSelection
}: Props) {
  const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false)
  const isEmpty = folderEntryCount === 0

  return selectable ? (
    <div
      className={clsx(
        styles.entry_link,
        styles.folder_link,
        isActiveStyle && styles.highlight_active
      )}
    >
      <IconFolderFilled size={18} />
      <span className={styles.label}>{folder.name}</span>
      <EntryCheckbox
        type="folder"
        onChange={(checked) => updateSelection({ type: "folder", id: folder.id }, checked)}
      />
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
          <IconFolderFilled size={18} />
          <span className={styles.label}>{folder.name}</span>
          <span className={styles.count}>{folderEntryCount}</span>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <MenuItemForRename />
        <MenuItemForMove folderId={folder.id} closeMenu={() => setIsOpenedContextMenu(false)} />
        <Menu.Divider />
        <MenuItemForDelete
          isEmpty={isEmpty}
          folder={folder}
          setIsOpenedContextMenu={setIsOpenedContextMenu}
        />
      </Menu.Dropdown>
    </Menu>
  )
}
