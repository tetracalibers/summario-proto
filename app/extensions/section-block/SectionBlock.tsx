import { NodeViewWrapper, NodeViewContent, type ReactNodeViewProps } from "@tiptap/react"
import "./style.scss"

export default ({ node }: ReactNodeViewProps) => {
  return (
    <NodeViewWrapper className="section-block">
      <NodeViewContent data-block-type={node.attrs.type} />
    </NodeViewWrapper>
  )
}
