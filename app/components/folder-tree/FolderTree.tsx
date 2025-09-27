import { Group, Tree, type RenderTreeNodePayload, type TreeNodeData } from "@mantine/core"
import { IconFolder, IconFolderOpen, IconFile } from "@tabler/icons-react"

interface FileIconProps {
  isFolder: boolean
  expanded: boolean
}
const FileIcon = ({ isFolder, expanded }: FileIconProps) => {
  if (isFolder) {
    return expanded ? <IconFolderOpen /> : <IconFolder />
  }
  return <IconFile />
}

const Leaf = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
  return (
    <Group gap={5} {...elementProps}>
      <FileIcon isFolder={hasChildren} expanded={expanded} />
      <span>{node.label}</span>
    </Group>
  )
}

interface FolderTreeProps {
  data: TreeNodeData[]
}
const FolderTree = ({ data }: FolderTreeProps) => {
  return (
    <Tree
      selectOnClick
      clearSelectionOnOutsideClick
      data={data}
      renderNode={(payload) => <Leaf {...payload} />}
    />
  )
}

export default FolderTree
