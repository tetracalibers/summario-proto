import { Split } from "@gfazioli/mantine-split-pane"
import { Paper, type TreeNodeData } from "@mantine/core"
import FolderTree from "~/components/folder-tree/FolderTree"

interface Props {
  folderTree: TreeNodeData[]
}

export default function SideLeft({ folderTree }: Props) {
  return (
    <Split orientation="horizontal" h="100%" spacing="md">
      <Split.Pane grow minHeight="30%">
        <Paper shadow="xs" withBorder p="1rem" h="100%">
          <FolderTree data={folderTree} />
        </Paper>
      </Split.Pane>
      <Split.Resizer />
      <Split.Pane px={"1rem"} minHeight="20%">
        <pre>Network Graph</pre>
      </Split.Pane>
    </Split>
  )
}
