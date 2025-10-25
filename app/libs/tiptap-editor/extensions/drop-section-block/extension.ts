import { Extension } from "@tiptap/core"
import { Plugin } from "prosemirror-state"
import { createSectionBlockJson } from "../../utils"
import { testLog } from "~/libs/debug"

export const DropSectionBlock = Extension.create({
  name: "drop-section-block",

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            dragover: (_view, event) => {
              // エディタ全体をドロップ可能にする
              event.preventDefault()
            },
            drop: (view, event) => {
              const title = event.dataTransfer?.getData("application/x-block-title")
              if (!title) return false // TipTapのデフォルトの挙動に任せる

              // 座標から近傍の pos を取得
              const droppedCoords = { left: event.clientX, top: event.clientY }
              const droppedPos = view.posAtCoords(droppedCoords)
              if (!droppedPos) return false

              // dropされた位置がnode内かnode間か
              const isInsideNode = droppedPos.inside > 0
              testLog("isInsideNode", isInsideNode)

              //
              // nodeの間にdropされた場合
              //

              // nodeの間にdropされた場合はそこに挿入
              if (!isInsideNode) {
                editor.commands.insertContentAt(droppedPos.pos, createSectionBlockJson(title))
                return true // TipTapのデフォルトのドロップ処理を停止
              }

              //
              // node内にdropされた場合
              //

              // dropされた位置にあるnode
              const nodeAtDroppedPos = view.state.doc.nodeAt(droppedPos.pos - 1)
              if (!nodeAtDroppedPos) return false
              testLog("nodeAtDroppedPos.type.name", nodeAtDroppedPos.type.name)

              // テキストの途中にdropされた場合は何もしない
              if (nodeAtDroppedPos.type.name === "text") return false

              // depthを調べる
              const droppedNodeDepth = view.state.doc.resolve(droppedPos.pos).depth
              testLog("droppedNodeDepth", droppedNodeDepth)

              // トップレベルのparagraphにdropされた場合はそこに挿入
              if (nodeAtDroppedPos.type.name === "paragraph" && droppedNodeDepth === 1) {
                editor.commands.insertContentAt(droppedPos.pos, createSectionBlockJson(title))
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
