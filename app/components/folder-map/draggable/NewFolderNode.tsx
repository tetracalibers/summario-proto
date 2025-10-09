import { TextInput } from "@mantine/core"
import { IconGripHorizontal, IconFolder } from "@tabler/icons-react"
import { useState } from "react"
import styles from "./NewNode.module.css"

export default function NewFolderNode() {
  const [name, setName] = useState("")

  return (
    <div className={styles.node} draggable>
      <TextInput
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="Enter folder name and drag"
        aria-label="Enter folder name and drag"
        leftSection={<IconFolder color="var(--mantine-color-bright-orange-6)" size={24} />}
        leftSectionPointerEvents="none"
      />
      <IconGripHorizontal size={16} className={styles.grip_icon} />
    </div>
  )
}
