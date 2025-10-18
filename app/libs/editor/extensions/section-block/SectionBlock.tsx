import { NodeViewWrapper, NodeViewContent, type ReactNodeViewProps } from "@tiptap/react"
import styles from "./style.module.css"

export default ({ node }: ReactNodeViewProps) => {
  return (
    <NodeViewWrapper className={styles.sectionBlock}>
      <NodeViewContent data-block-type={node.attrs.type} />
    </NodeViewWrapper>
  )
}
