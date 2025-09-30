import { useEditor, type Content } from "@tiptap/react"
import { createSectionBlockJson } from "~/extensions/section-block/helper"
import { tiptapExtensions } from "./extensions"

export const useTiptapEditor = (initialContent?: Content) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: false, // Disable immediate rendering to prevent SSR issues
    extensions: tiptapExtensions,
    editorProps: {
      handleDrop: (view, event, _slice, _moved) => {
        if (!editor) return false

        const block = event.dataTransfer?.getData("application/x-block")
        if (!block) return false // TipTapのデフォルトの挙動に任せる

        const blockInfo = JSON.parse(block)

        // dropされた位置
        const droppedPoint = view.posAtCoords({ left: event.clientX, top: event.clientY })
        if (!droppedPoint) return false

        // dropされた位置にある要素
        // nodeの間にdropされた場合はnullになるが、その場合は最後に処理するのでnullでも弾かない
        const droppedNode = view.state.doc.nodeAt(droppedPoint.pos - 1)

        const isLastNode =
          view.state.doc.resolve(view.state.doc.content.size).nodeBefore === droppedNode
        // resolveでエラーになってしまうため、ここで処理
        if (isLastNode) {
          editor.commands.insertContentAt(
            droppedPoint.pos,
            createSectionBlockJson(blockInfo.type, blockInfo.label)
          )
          return true
        }

        // テキストの途中にdropされた場合は何もしない
        // resolveでエラーになってしまうため、ここで弾く
        if (droppedNode?.type.name === "text") return false
        // セクションブロックの中には入れない
        if (droppedNode?.type.name === "sectionBlock") return false

        // depthを調べるためにNodePosに変換
        const droppedNodePos = view.state.doc.resolve(droppedPoint.pos)

        // トップレベルのparagraphにdropされた場合は置き換える
        if (droppedNode?.type.name === "paragraph" && droppedNodePos.depth === 1) {
          editor.commands.insertContentAt(
            droppedPoint.pos,
            createSectionBlockJson(blockInfo.type, blockInfo.label)
          )

          return true // TipTapのデフォルトのドロップ処理を停止
        }

        // paragraph以外のnodeにdropされた場合は何もしない
        if (droppedNodePos.depth > 0) return false

        // nodeの間にdropされた場合はその位置に挿入
        editor.commands.insertContentAt(
          droppedPoint.pos,
          createSectionBlockJson(blockInfo.type, blockInfo.label)
        )

        return true
      }
    },
    content: initialContent
  })

  return editor
}
