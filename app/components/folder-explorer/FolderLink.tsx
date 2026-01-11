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
  useMoveToFolderUi
} from "~/usecases/folder-explorer/move-to-folder/ui.hooks"
import { notifications } from "@mantine/notifications"
import { errorContent, successContent } from "~/libs/mantine-notifications/options"
import LoadingLabel from "../loading-label/LoadingLabel"

interface Props {
  currentTermId: number
  folder: { id: number; name: string }
  folderEntryCount: number
  isActiveStyle: boolean
  onLinkClick: () => void
  selectable: boolean
  selectedCount: number
}

export default function FolderLink({
  currentTermId,
  folder,
  folderEntryCount,
  isActiveStyle,
  onLinkClick,
  selectable,
  selectedCount
}: Props) {
  const [isOpenedContextMenu, setIsOpenedContextMenu] = useState(false)
  const { destFolder, setDestFolder, execMoveApi, isMoving } = useMoveToFolderUi(currentTermId)
  const { updateCheckedFolder } = useCheckFolderToMoveUi()
  const isEmpty = folderEntryCount === 0

  return selectable ? (
    <div className={clsx(styles.entry_link, styles.folder_link, styles.selectable)}>
      <IconFolderFilled size={18} className={styles.entry_icon} />
      <span className={styles.label}>{folder.name}</span>
      {destFolder?.id === folder.id ? (
        <Button
          variant="outline"
          color="pink"
          size="compact-xs"
          radius="sm"
          leftSection={<IconLogin2 size={14} />}
          className={styles.move_here_button}
          styles={{
            inner: { gap: 4 },
            section: { margin: 0 },
            label: { fontSize: "0.7rem" }
          }}
          disabled={selectedCount === 0 || isMoving}
          loading={isMoving}
          loaderProps={{
            children: <LoadingLabel doing="Moving" iconSize={14} />
          }}
          onClick={() => {
            execMoveApi({
              onSuccess: ({ message }) => {
                notifications.show(successContent(message))
              },
              onError: ({ errors }) => {
                errors.forEach(({ message }) => {
                  notifications.show(errorContent(message))
                })
              }
            })
          }}
        >
          Move Here
        </Button>
      ) : (
        <EntryCheckbox type="folder" onChange={() => updateCheckedFolder(folder)} />
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
          folder={folder}
          closeMenu={() => setIsOpenedContextMenu(false)}
          setDestFolder={setDestFolder}
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
