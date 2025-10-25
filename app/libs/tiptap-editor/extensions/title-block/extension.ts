import { Node } from "@tiptap/core"
import { TITLE_BLOCK } from "../../constants"

export const TitleBlockNode = Node.create({
  name: TITLE_BLOCK,
  // group:"block"にしてしまうと、CustomDocument.contentの定義上、複数のtitle_blockが許容されてしまう
  group: "title",
  content: "inline*",
  marks: "code",
  parseHTML() {
    return [{ tag: "title-block" }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", HTMLAttributes, 0]
  }
})
