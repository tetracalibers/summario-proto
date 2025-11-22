import { Menu } from "@mantine/core"
import { IconLogin2 } from "@tabler/icons-react"

export default function MenuItemForMove() {
  return <Menu.Item leftSection={<IconLogin2 size={16} />}>ここに移動するアイテムを選択</Menu.Item>
}
