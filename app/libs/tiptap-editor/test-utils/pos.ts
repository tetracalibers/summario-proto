import type { Node } from "@tiptap/pm/model"

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
