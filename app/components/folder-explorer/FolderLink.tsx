import {
  IconFolderFilled,
  IconTrash,
  IconEdit,
  IconHelp,
  IconExternalLink
} from "@tabler/icons-react"
import { ActionIcon, HoverCard, Menu, UnstyledButton, Text, Group, Stack } from "@mantine/core"
import { clsx } from "clsx"
import styles from "./EntryLink.module.css"
import { useState } from "react"
import { Link } from "react-router"

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
  folderName: string
  isActiveStyle: boolean
  isEmpty: boolean
  onClick: () => void
}

export default function FolderLink({ folderName, isActiveStyle, isEmpty, onClick }: Props) {
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
      styles={{
        arrow: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" },
        dropdown: { "--popover-border-color": "var(--mantine-color-pale-indigo-2)" }
      }}
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
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
          rightSection={!isEmpty && <DeleteDisabledHelp />}
          disabled={!isEmpty}
          component={isEmpty ? "button" : "div"}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
