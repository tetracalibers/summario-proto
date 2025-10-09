import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType
} from "@xyflow/react"
import { IconFolderFilled, IconFolder } from "@tabler/icons-react"
import styles from "./node.module.css"

const MAX_TARGET_CONNECTIONS = 1

interface FolderNodeHandleProps {
  type: HandleType
}

const FolderNodeHandle = ({ type }: FolderNodeHandleProps) => {
  const connections = useNodeConnections()
  return (
    <Handle
      type={type}
      position={type === "target" ? Position.Left : Position.Right}
      isConnectable={type === "target" ? connections.length < MAX_TARGET_CONNECTIONS : true}
    />
  )
}

interface FolderNodeData {
  label: string
  [key: string]: unknown
}

interface FolderNodeProps extends NodeProps<Node<FolderNodeData>> {}

export function FolderNode({ data }: FolderNodeProps) {
  return (
    <div className={styles.node}>
      <FolderNodeHandle type="target" />
      <div className={styles.node_with_icon}>
        <IconFolder className={styles.node_icon} />
        <div>{data.label}</div>
      </div>
      <FolderNodeHandle type="source" />
    </div>
  )
}
