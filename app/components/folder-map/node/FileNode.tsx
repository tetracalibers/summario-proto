import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType
} from "@xyflow/react"
import styles from "./Node.module.css"
import { useState } from "react"
import { TextInput } from "@mantine/core"
import { IconNote } from "@tabler/icons-react"

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
      isConnectable={connections.length < MAX_CONNECTIONS}
      className={styles.handle}
    />
  )
}

interface FileNodeData {
  label: string
  isContentEmpty: boolean
  [key: string]: unknown
}

interface FileNodeProps extends NodeProps<Node<FileNodeData>> {}

export function FileNode({ data }: FileNodeProps) {
  const [name, setName] = useState(data.label)

  return (
    <div className={styles.node}>
      <FileNodeHandle type="target" />
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="File Name"
        aria-label="file name"
        leftSection={<IconNote size={24} color="var(--mantine-color-cyan-4)" />}
        leftSectionPointerEvents="none"
        disabled={!data.isContentEmpty}
        className={styles.input_maybe_disabled}
      />
    </div>
  )
}
