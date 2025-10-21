import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import styles from "./style.module.css"

export default () => {
  return (
    <NodeViewWrapper className={styles.sectionBlock}>
      <NodeViewContent />
    </NodeViewWrapper>
  )
}
