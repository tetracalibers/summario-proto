import { Menu } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"

export default function MenuItemForRename() {
  return <Menu.Item leftSection={<IconEdit size={16} />}>フォルダ名を変更</Menu.Item>
}
