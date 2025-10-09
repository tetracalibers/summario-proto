import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType
} from "@xyflow/react"
import { IconFolder } from "@tabler/icons-react"
import styles from "./node.module.css"
import { TextInput } from "@mantine/core"
import { useState } from "react"

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
      className={styles.handle}
    />
  )
}

interface FolderNodeData {
  label: string
  [key: string]: unknown
}

interface FolderNodeProps extends NodeProps<Node<FolderNodeData>> {}

export function FolderNode({ data }: FolderNodeProps) {
  const [name, setName] = useState(data.label)

  return (
    <div className={styles.node}>
      <FolderNodeHandle type="target" />
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="Folder Name"
        aria-label="folder name"
        leftSection={<IconFolder className={styles.node_icon} />}
      />
      <FolderNodeHandle type="source" />
    </div>
  )
}
