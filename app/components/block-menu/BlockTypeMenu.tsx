import BLOCK_TYPES from "./block-type.json"
import { Stack } from "@mantine/core"
import styles from "./card.module.css"

const BlockTypeMenu = () => {
  return (
    <Stack gap="sm">
      {BLOCK_TYPES.map((block) => (
        <div
          className={styles.card_body}
          draggable
          key={block.name}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "application/x-block",
              JSON.stringify({ type: block.name, label: block.label })
            )
          }}
        >
          <div>
            <div className={styles.card_title}>{block.label}</div>
            <div className={styles.card_subtitle}>{block.label_ja}</div>
          </div>
          <div className={styles.card_content}>{block.description}</div>
        </div>
      ))}
    </Stack>
  )
}

export default BlockTypeMenu
