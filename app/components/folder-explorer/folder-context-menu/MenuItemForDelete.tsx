import { ActionIcon, Group, HoverCard, Menu, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconExternalLink, IconHelp, IconTrash } from "@tabler/icons-react"
import { Link } from "react-router"
import IconLoadingSpinner from "~/components/icon-loading-spinner/IconLoadingSpinner"
import { errorContent, successContent } from "~/libs/mantine-notifications/options"
import { useEmptyFolderDeleteUi } from "~/usecases/folder-explorer/delete/ui.hooks"

interface Props {
  isEmpty: boolean
  folder: {
    id: number
    name: string
  }
  setIsOpenedContextMenu: (opened: boolean) => void
}

export default function MenuItemForDelete({ isEmpty, folder, setIsOpenedContextMenu }: Props) {
  const { deleteFolder, isDeleting } = useEmptyFolderDeleteUi()

  return (
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
            setIsOpenedContextMenu(false)
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
  )
}

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
