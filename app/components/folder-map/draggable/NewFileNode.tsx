import { TextInput } from "@mantine/core"
import { IconGripHorizontal, IconNote } from "@tabler/icons-react"
import { useState } from "react"
import styles from "./NewNode.module.css"

export default function NewFileNode() {
  const [name, setName] = useState("")

  return (
    <div className={styles.node} draggable>
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="Enter file name and drag"
        aria-label="Enter file name and drag"
        leftSection={<IconNote color="var(--mantine-color-cyan-4)" size={24} />}
        leftSectionPointerEvents="none"
      />
      <IconGripHorizontal size={16} className={styles.grip_icon} />
    </div>
  )
}
