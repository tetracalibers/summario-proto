import { Menu } from "@mantine/core"
import { IconLogin2 } from "@tabler/icons-react"

interface Props {
  folder: { id: number | null; name: string }
  closeMenu: () => void
  setDestFolder: (folder: { id: number | null; name: string }) => void
}

export default function MenuItemForMove({ folder, closeMenu, setDestFolder }: Props) {
  return (
    <Menu.Item
      leftSection={<IconLogin2 size={16} />}
      onClick={() => {
        setDestFolder(folder)
        closeMenu()
      }}
    >
      ここに移動するアイテムを選択
    </Menu.Item>
  )
}
