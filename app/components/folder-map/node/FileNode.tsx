import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType,
  NodeToolbar
} from "@xyflow/react"
import styles from "./Node.module.css"
import { useState } from "react"
import { ActionIcon, Group, TextInput } from "@mantine/core"
import { IconExternalLink, IconNote, IconTrash } from "@tabler/icons-react"
import { clsx } from "clsx"

const MAX_CONNECTIONS = 1

interface FileNodeHandleProps {
  type: HandleType
}

const FileNodeHandle = ({ type }: FileNodeHandleProps) => {
  const connections = useNodeConnections({ handleType: type })
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

export function FileNode({ data, deletable, selected }: FileNodeProps) {
  const [name, setName] = useState(data.label)

  return (
    <>
      <FileNodeHandle type="target" />
      <NodeToolbar>
        <Group justify="center" gap="sm" className={styles.toolbar_inner}>
          <ActionIcon variant="light" color="cyan" aria-label="open note">
            <IconExternalLink size={18} />
          </ActionIcon>
          {deletable && (
            <ActionIcon variant="light" color="pink" aria-label="delete node">
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </Group>
      </NodeToolbar>
      <div className={clsx(styles.node, selected && styles.selected)}>
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
    </>
  )
}
