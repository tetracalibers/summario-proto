import { Group, Tree, type RenderTreeNodePayload, type TreeNodeData } from "@mantine/core"
import { IconFolder, IconFolderOpen, IconFile } from "@tabler/icons-react"
import { NavLink } from "react-router"

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

const LeafContent = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
  return (
    <Group gap={5} {...elementProps}>
      <FileIcon isFolder={hasChildren} expanded={expanded} />
      <span>{node.label}</span>
    </Group>
  )
}

const Leaf = (payload: RenderTreeNodePayload) => {
  return payload.hasChildren ? (
    <LeafContent {...payload} />
  ) : (
    <NavLink to={`/terms/${payload.node.value}`}>
      <LeafContent {...payload} />
    </NavLink>
  )
}

interface FolderTreeProps {
  data: TreeNodeData[]
}
const FolderTree = ({ data }: FolderTreeProps) => {
  return <Tree data={data} renderNode={(payload) => <Leaf {...payload} />} />
}

export default FolderTree
