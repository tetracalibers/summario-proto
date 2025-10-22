import { mergeAttributes, Node } from "@tiptap/core"

export const TitleBlockNode = Node.create({
  name: "title_block",
  // group:"block"にしてしまうと、CustomDocument.contentの定義上、複数のtitle_blockが許容されてしまう
  group: "title",
  content: "inline*",
  marks: "code",
  draggable: false,
  defining: false,
  selectable: false,
  parseHTML() {
    return [{ tag: "title-block" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", mergeAttributes(HTMLAttributes), 0]
  }
})
