import { TextInput } from "@mantine/core"
import { IconGripHorizontal, IconFolder } from "@tabler/icons-react"
import { useCallback, useState } from "react"
import styles from "./NewNode.module.css"
import { useReactFlow, type XYPosition } from "@xyflow/react"
import { isInMapArea } from "./drop-area"
import { createTmpFolderNodeId } from "../node-edge-id"
import DraggableNode from "./DraggableNode"

export default function NewFolderNode() {
  const [name, setName] = useState("")
  const { setNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeDrop = useCallback(
    (nodeType: string, screenPosition: XYPosition) => {
      if (!isInMapArea(screenPosition)) return

      // Create a new node and add it to the flow
      const position = screenToFlowPosition(screenPosition)
      const trimmedName = name.trim()
      const newNode = {
        id: createTmpFolderNodeId(),
        type: nodeType,
        position,
        data: {
          label: trimmedName.length > 0 ? trimmedName : "No Title",
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
    <DraggableNode className={styles.node} nodeType="folder" onDrop={handleNodeDrop}>
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="Enter folder name and drag"
        aria-label="Enter folder name and drag"
        leftSection={<IconFolder color="var(--mantine-color-bright-orange-6)" size={24} />}
        leftSectionPointerEvents="none"
      />
      <IconGripHorizontal size={16} className={styles.grip_icon} />
    </DraggableNode>
  )
}
