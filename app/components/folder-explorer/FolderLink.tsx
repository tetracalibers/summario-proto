import {
  IconFolderFilled,
  IconTrash,
  IconEdit,
  IconHelp,
  IconExternalLink,
  IconLogin2
} from "@tabler/icons-react"
import { ActionIcon, HoverCard, Menu, UnstyledButton, Text, Group, Stack } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"
import { useState } from "react"
import { Link } from "react-router"
import { useEmptyFolderDeleteUi } from "~/usecases/folder-explorer/delete/ui.hooks"
import { notifications } from "@mantine/notifications"
import { errorContent, successContent } from "~/libs/mantine-notifications/options"
import IconLoadingSpinner from "../icon-loading-spinner/IconLoadingSpinner"
import EntryCheckbox from "./EntryCheckbox"
import type { Entry } from "~/usecases/folder-explorer/types"

function DeleteDisabledHelp() {
  return (
    <HoverCard
      shadow="md"
      withArrow
      arrowPosition="center"
      position="right"
      offset={0}
      styles={{
        arrow: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" },
        dropdown: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" }
      }}
    >
      <HoverCard.Target>
        <ActionIcon variant="white" color="gray" radius="xl" aria-label="help">
          <IconHelp size={16} />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack gap={6}>
          <Text size="xs">空でないフォルダは削除できません。</Text>
          <Link
            to="/folder-map"
            reloadDocument
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "var(--mantine-color-pink-6)"
            }}
          >
            <Group gap={4} justify="end" align="center">
              <Text size="xs">フォルダ構成を編集</Text>
              <IconExternalLink size={14} color="var(--mantine-color-pink-5)" />
            </Group>
          </Link>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

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
  const [openedMenu, setOpenedMenu] = useState(false)
  const isEmpty = folderEntryCount === 0

  const { deleteFolder, isDeleting } = useEmptyFolderDeleteUi()

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
      opened={openedMenu}
      onChange={setOpenedMenu}
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
          <span className={styles.label}>{folder.name}</span>
          <span className={styles.count}>{folderEntryCount}</span>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconEdit size={16} />}>フォルダ名を変更</Menu.Item>
        <Menu.Item leftSection={<IconLogin2 size={16} />}>ここに移動するアイテムを選択</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={isDeleting ? <IconLoadingSpinner size={16} /> : <IconTrash size={16} />}
          rightSection={!isEmpty && <DeleteDisabledHelp />}
          disabled={!isEmpty || isDeleting}
          component={isEmpty ? "button" : "div"}
          onClick={() => {
            if (!isEmpty) return
            deleteFolder(folder, {
              onSuccess: () => {
                setOpenedMenu(false)
                notifications.show(successContent(`フォルダ「${folder.name}」を削除しました`))
              },
              onError: ({ detail }) => {
                notifications.show(errorContent(detail.message, detail.target))
              }
            })
          }}
        >
          フォルダを削除
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
