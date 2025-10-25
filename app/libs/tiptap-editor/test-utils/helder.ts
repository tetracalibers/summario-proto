import type { Node } from "@tiptap/pm/model"
import type { Editor } from "@tiptap/react"

// node直下のn番目のブロックノードの開始位置を返す（0-based index）
export const getBlockStartPos = (node: Node, n: number) => {
  return (
    node.children
      .slice(0, n)
      .filter((child) => child.isBlock)
      .map((child) => child.nodeSize)
      .reduce((a, b) => a + b, 0) + 1
  )
}

// node直下のn番目のブロックノードの終端位置を返す（0-based index）
export const getBlockEndPos = (node: Node, n: number) => {
  return getBlockStartPos(node, n) + node.child(n).nodeSize - 1
}

// カーソルは前のノードの末尾に移動していることを確認するための情報を取得
export const infoCursorAtPrevNodeEnd = (editor: Editor) => {
  const prevNode = editor.state.doc.nodeAt(editor.state.selection.from - 1)

  // 段落末尾位置確認
  const prevNodeStart = editor.state.selection.from - prevNode!.nodeSize + 1
  const prevNodeEnd = prevNodeStart + prevNode!.nodeSize - 1

  const cursorPos = editor.state.selection.from

  return { prevNode, prevNodeEnd, cursorPos }
}
