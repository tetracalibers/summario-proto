import { TextInput } from "@mantine/core"
import { IconGripHorizontal, IconNote } from "@tabler/icons-react"
import styles from "./NewNode.module.css"
import { useReactFlow, type XYPosition, type Node } from "@xyflow/react"
import { createTmpFileNodeId } from "../node-edge-id"
import DraggableNode from "./DraggableNode"
import { useCallback, useState } from "react"
import { isInMapArea } from "./drop-area"
import { FILE_NODE_TYPE, type FileNodeData } from "../custom-node"

export default function NewFileNode() {
  const [name, setName] = useState("")
  const { setNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeDrop = useCallback(
    (screenPosition: XYPosition) => {
      if (!isInMapArea(screenPosition)) return

      // Create a new node and add it to the flow
      const position = screenToFlowPosition(screenPosition)
      const newNode: Node<FileNodeData> = {
        id: createTmpFileNodeId(),
        type: FILE_NODE_TYPE,
        position,
        data: {
          label: name.trim(),
          isContentEmpty: true,
          tmp: true
        },
        deletable: true
      }
      setNodes((nds) => [...nds, newNode])
      // Reset the input field
      setName("")
    },
    [name, screenToFlowPosition, setNodes, setName]
  )

  return (
    <DraggableNode className={styles.node} onDrop={handleNodeDrop}>
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="Enter file name and drag"
        aria-label="Enter file name and drag"
        leftSection={<IconNote color="var(--mantine-color-cyan-4)" size={24} />}
        leftSectionPointerEvents="none"
      />
      <IconGripHorizontal size={16} className={styles.grip_icon} />
    </DraggableNode>
  )
}
