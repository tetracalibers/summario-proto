import { Menu } from "@mantine/core"
import { IconLogin2 } from "@tabler/icons-react"
import { useSwitchMovingModeUi } from "~/usecases/folder-explorer/move-to-folder/ui.hooks"

interface Props {
  folderId: number
  closeMenu: () => void
}

export default function MenuItemForMove({ folderId, closeMenu }: Props) {
  const { setDestinationFolderId } = useSwitchMovingModeUi()

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
