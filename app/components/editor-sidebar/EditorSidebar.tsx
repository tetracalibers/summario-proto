import { Paper, Tabs } from "@mantine/core"
import { IconDragDrop2, IconFolder } from "@tabler/icons-react"
import FolderExplorer from "../folder-explorer/FolderExplorer"
import BlockTypeMenu from "../block-menu/BlockTypeMenu"
import type { loader } from "~/routes/api/folders/children"
import ScrollArea from "../scroll-area/ScrollArea"

interface Props {
  currentTermId: number
  initialFolders: Awaited<ReturnType<typeof loader>>
  paths: Set<number>
}

export default function EditorSidebar({ currentTermId, initialFolders, paths }: Props) {
  return (
    <Tabs
      variant="default"
      color="pink"
      radius="md"
      defaultValue="folders"
      styles={{
        root: {
          paddingInline: "0.25rem",
          height: "calc(100% - 0.5rem)"
        },
        list: {
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "white",
          marginBlockStart: "0.25rem"
        },
        panel: {
          paddingBlockStart: "0.75rem",
          height: "calc(100% - 38px - 0.5rem)"
        },
        tabSection: {
          marginInlineEnd: "0.35rem"
        }
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="folders" leftSection={<IconFolder size={14} />}>
          Folders
        </Tabs.Tab>
        <Tabs.Tab value="blocks" leftSection={<IconDragDrop2 size={16} />}>
          Blocks
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="folders">
        <Paper shadow="0" withBorder p="0" h="100%">
          <FolderExplorer
            currentTermId={currentTermId}
            initials={initialFolders}
            pathFolderIds={paths}
          />
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="blocks">
        <ScrollArea h="100%" pb="0">
          <BlockTypeMenu />
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  )
}
