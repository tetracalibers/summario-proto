import { Split } from "@gfazioli/mantine-split-pane"
import { Paper, ScrollArea, type TreeNodeData } from "@mantine/core"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import FolderTree from "~/components/folder-tree/FolderTree"

interface Props {
  folderTree: TreeNodeData[]
}

export default function SideLeft({ folderTree }: Props) {
  return (
    <Split orientation="horizontal" h="100%" spacing="md">
      <Split.Pane>
        <Paper shadow="xs" withBorder p="1rem" h="100%">
          <FolderTree data={folderTree} />
        </Paper>
      </Split.Pane>
      <Split.Resizer />
      <Split.Pane px={"1rem"} grow minHeight="20%">
        <ScrollArea h="100%" pr="1rem" pb="1rem">
          <BlockTypeMenu />
          <div>TODO: 参考書籍ブロック</div>
        </ScrollArea>
      </Split.Pane>
    </Split>
  )
}
