import { Menu } from "@mantine/core"
import { IconLogin2 } from "@tabler/icons-react"

interface Props {
  folderId: number
  closeMenu: () => void
  setDestinationFolderId: (id: number) => void
}

export default function MenuItemForMove({ folderId, closeMenu, setDestinationFolderId }: Props) {
  return (
    <Menu.Item
      leftSection={<IconLogin2 size={16} />}
      onClick={() => {
        setDestinationFolderId(folderId)
        closeMenu()
      }}
    >
      ここに移動するアイテムを選択
    </Menu.Item>
  )
}
