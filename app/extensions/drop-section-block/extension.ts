import { Extension } from "@tiptap/core"
import { Plugin } from "prosemirror-state"
import { createSectionBlockJson } from "../section-block/helper"

export const DropSectionBlock = Extension.create({
  name: "drop-section-block",

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const data = event.dataTransfer?.getData("application/x-block")
              if (!data) return false // TipTapのデフォルトの挙動に任せる

              const block = (() => {
                try {
                  return JSON.parse(data)
                } catch {
                  return null
                }
              })()
              if (!block) return false

              // 座標から近傍の pos を取得
              const droppedCoords = { left: event.clientX, top: event.clientY }
              const droppedPos = view.posAtCoords(droppedCoords)
              if (!droppedPos) return false

              // dropされた位置にあるnode
              // nodeの間にdropされた場合はnullになる
              const nodeAtDroppedPos = view.state.doc.nodeAt(droppedPos.pos - 1)
              // dropされた位置がnode内かnode間か
              const isInsideNode = nodeAtDroppedPos !== null

              //
              // nodeの間にdropされた場合
              //

              // nodeの間にdropされた場合はそこに挿入
              if (!isInsideNode) {
                editor.commands.insertContentAt(
                  droppedPos.pos,
                  createSectionBlockJson(block.type, block.label)
                )
                return true // TipTapのデフォルトのドロップ処理を停止
              }

              //
              // node内にdropされた場合
              //

              // テキストの途中にdropされた場合は何もしない
              if (nodeAtDroppedPos.type.name === "text") return false
              // セクションブロックの中には入れない
              if (nodeAtDroppedPos.type.name === "sectionBlock") return false

              // 最後のnodeにdropされた場合はそこに挿入
              // resolveでエラーになってしまうため、先に処理
              const isLastNode =
                view.state.doc.resolve(view.state.doc.content.size).nodeBefore === nodeAtDroppedPos
              if (isLastNode) {
                editor.commands.insertContentAt(
                  droppedPos.pos,
                  createSectionBlockJson(block.type, block.label)
                )
                return true
              }

              // depthを調べる
              const droppedNodeDepth = view.state.doc.resolve(droppedPos.pos).depth

              // トップレベルのparagraphにdropされた場合はそこに挿入
              if (nodeAtDroppedPos.type.name === "paragraph" && droppedNodeDepth === 1) {
                editor.commands.insertContentAt(
                  droppedPos.pos,
                  createSectionBlockJson(block.type, block.label)
                )
                return true
              }

              // それ以外のnodeにdropされた場合は何もしない
              return false
            }
          }
        }
      })
    ]
  }
})
