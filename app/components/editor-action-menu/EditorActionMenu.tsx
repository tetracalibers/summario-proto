import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons-react"

export default function EditorActionMenu() {
  return (
    <Menu shadow="md" width={150} position="bottom-end">
      <Menu.Target aria-label="editor action menu">
        <ActionIcon radius="xl" variant="white" color="gray">
          <IconDots size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
