import { TextInput } from "@mantine/core"
import { IconGripHorizontal, IconNote } from "@tabler/icons-react"
import styles from "./NewNode.module.css"
import { useReactFlow, type XYPosition } from "@xyflow/react"
import { createTmpFileNodeId } from "../node-edge-id"
import DraggableNode from "./DraggableNode"
import { useCallback, useState } from "react"

export default function NewFileNode() {
  const [name, setName] = useState("")
  const { setNodes, screenToFlowPosition } = useReactFlow()

  const handleNodeDrop = useCallback(
    (nodeType: string, screenPosition: XYPosition) => {
      const flow = document.querySelector(".react-flow")
      if (!flow) return

      const flowRect = flow.getBoundingClientRect()
      if (!flowRect) return

      const isInFlow =
        screenPosition.x >= flowRect.left &&
        screenPosition.x <= flowRect.right &&
        screenPosition.y >= flowRect.top &&
        screenPosition.y <= flowRect.bottom
      if (!isInFlow) return

      // Create a new node and add it to the flow
      const position = screenToFlowPosition(screenPosition)
      const trimmedName = name.trim()
      const newNode = {
        id: createTmpFileNodeId(),
        type: nodeType,
        position,
        data: {
          label: trimmedName.length > 0 ? trimmedName : "No Title",
          isContentEmpty: true,
          tmp: true
        }
      }
      setNodes((nds) => [...nds, newNode])
      // Reset the input field
      setName("")
    },
    [name, screenToFlowPosition, setNodes, setName]
  )

  return (
    <DraggableNode className={styles.node} nodeType="file" onDrop={handleNodeDrop}>
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
