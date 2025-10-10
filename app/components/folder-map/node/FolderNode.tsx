import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  useNodeConnections,
  type HandleType,
  NodeToolbar
} from "@xyflow/react"
import { IconFolder, IconTrash } from "@tabler/icons-react"
import styles from "./Node.module.css"
import { ActionIcon, Group, TextInput } from "@mantine/core"
import { useState } from "react"
import clsx from "clsx"

const MAX_TARGET_CONNECTIONS = 1

interface FolderNodeHandleProps {
  type: HandleType
}

const FolderNodeHandle = ({ type }: FolderNodeHandleProps) => {
  const connections = useNodeConnections({ handleType: type })
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

export function FolderNode({ data, deletable, selected }: FolderNodeProps) {
  const [name, setName] = useState(data.label)

  return (
    <>
      <FolderNodeHandle type="target" />
      {true && (
        <NodeToolbar>
          <Group justify="center" gap="sm" className={styles.toolbar_inner}>
            <ActionIcon variant="light" color="pink" aria-label="delete node">
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </NodeToolbar>
      )}
      <div className={clsx(styles.node, selected && styles.selected)}>
        <TextInput
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Folder Name"
          aria-label="folder name"
          leftSection={<IconFolder size={24} color="var(--mantine-color-bright-orange-6)" />}
          leftSectionPointerEvents="none"
        />
      </div>
      <FolderNodeHandle type="source" />
    </>
  )
}
