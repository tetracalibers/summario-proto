import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType
} from "@xyflow/react"
import styles from "./node.module.css"

const MAX_CONNECTIONS = 1

interface FileNodeHandleProps {
  type: HandleType
}

const FileNodeHandle = ({ type }: FileNodeHandleProps) => {
  const connections = useNodeConnections()
  return (
    <Handle
      type={type}
      position={type === "target" ? Position.Left : Position.Right}
      isConnectable={connections.length <= MAX_CONNECTIONS}
    />
  )
}

interface FileNodeData {
  label: string
  [key: string]: unknown
}

interface FileNodeProps extends NodeProps<Node<FileNodeData>> {}

export function FileNode({ data }: FileNodeProps) {
  return (
    <div className={styles.node}>
      <FileNodeHandle type="target" />
      <div>{data.label}</div>
    </div>
  )
}
