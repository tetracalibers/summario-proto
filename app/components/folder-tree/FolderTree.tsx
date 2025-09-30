import {
  getTreeExpandedState,
  Group,
  Tree,
  useTree,
  type RenderTreeNodePayload,
  type TreeNodeData
} from "@mantine/core"
import { IconFolder, IconFolderOpen, IconFile, type IconProps } from "@tabler/icons-react"
import { NavLink } from "react-router"

interface FileIconProps extends IconProps {
  isFolder: boolean
  expanded: boolean
}
const FileIcon = ({ isFolder, expanded, ...iconProps }: FileIconProps) => {
  if (isFolder) {
    return expanded ? <IconFolderOpen {...iconProps} /> : <IconFolder {...iconProps} />
  }
  return <IconFile {...iconProps} />
}

const LeafContent = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
  return (
    <Group gap={5} wrap="nowrap" {...elementProps}>
      <FileIcon isFolder={hasChildren} expanded={expanded} color="#5D688A" size="18px" />
      <span
        style={{
          fontSize: "0.9rem",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        {node.label}
      </span>
    </Group>
  )
}

const Leaf = (payload: RenderTreeNodePayload) => {
  return payload.hasChildren ? (
    <LeafContent {...payload} />
  ) : (
    <NavLink
      to={`/terms/${payload.node.value}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <LeafContent {...payload} />
    </NavLink>
  )
}

interface FolderTreeProps {
  data: TreeNodeData[]
  currentFolderPath: string[] | null
}
const FolderTree = ({ data, currentFolderPath }: FolderTreeProps) => {
  const tree = useTree({
    initialExpandedState: getTreeExpandedState(data, currentFolderPath ?? [])
  })
  return <Tree tree={tree} data={data} renderNode={(payload) => <Leaf {...payload} />} />
}

export default FolderTree
