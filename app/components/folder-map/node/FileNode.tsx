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
import { IconExternalLink, IconNote } from "@tabler/icons-react"
import { clsx } from "clsx"
import { NavLink } from "react-router"
import { parseFileNodeId } from "../node-edge-id"
import DeleteNodeButton from "./DeleteNodeButton"
import type { FileNodeData } from "../custom-node"

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

interface FileNodeProps extends NodeProps<Node<FileNodeData>> {}

export function FileNode({ data, deletable, selected, id }: FileNodeProps) {
  const [name, setName] = useState(data.label)

  return (
    <>
      <FileNodeHandle type="target" />
      <NodeToolbar>
        <Group justify="center" gap="xs" className={styles.toolbar_inner}>
          <ActionIcon
            variant="light"
            color="cyan"
            aria-label="open note"
            component={NavLink}
            to={`/terms/${parseFileNodeId(id)}`}
          >
            <IconExternalLink size={18} />
          </ActionIcon>
          {deletable && <DeleteNodeButton id={id} />}
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
