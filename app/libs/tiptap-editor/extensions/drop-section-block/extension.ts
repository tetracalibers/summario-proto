import { type Editor, Extension } from "@tiptap/core"
import { Plugin } from "prosemirror-state"
import { createSectionBlockJson } from "../../utils"
import { testLog } from "~/libs/debug"
import { BLOCK_TITLE_MIME } from "../../constants"
import type { EditorView } from "@tiptap/pm/view"

const getBlockTitle = (e: DragEvent) => {
  return e.dataTransfer?.getData(BLOCK_TITLE_MIME) || null
}

const getDroppedPos = (view: EditorView, e: DragEvent) => {
  const coords = { left: e.clientX, top: e.clientY }
  return view.posAtCoords(coords)
}

const insertSectionAt = (editor: Editor, pos: number, title: string) => {
  editor.commands.insertContentAt(pos, createSectionBlockJson(title))
}

const isTopLevelParagraphAt = (view: EditorView, pos: number) => {
  const { state } = view

  const node = state.doc.nodeAt(pos - 1)
  if (!node) return false

  testLog("node.type.name", node.type.name)
  if (node.type.name === "text") return false

  const depth = state.doc.resolve(pos).depth
  testLog("depth", depth)

  return node.type.name === "paragraph" && depth === 1
}

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
              return true
            },
            drop: (view, event) => {
              // ドラッグ元のブロックタイトルがなければTipTapのデフォルトの挙動に任せる
              const title = getBlockTitle(event)
              if (!title) return false

              // ドロップ座標から近傍のposを取得（できなければデフォルトへ）
              const droppedPos = getDroppedPos(view, event)
              if (!droppedPos) return false

              const { pos, inside } = droppedPos
              const isInsideNode = inside > 0
              testLog("isInsideNode", isInsideNode)

              // --- ノードの「間」にドロップされた場合：その場所へ挿入
              if (!isInsideNode) {
                insertSectionAt(editor, pos, title)
                return true // TipTap のデフォルトのドロップ処理を停止
              }

              // --- ノード「内」にドロップされた場合の扱い
              // トップレベル paragraph ならその位置へ挿入
              if (isTopLevelParagraphAt(view, pos)) {
                insertSectionAt(editor, pos, title)
                return true
              }

              // それ以外（テキスト途中や他ノード内）は何もしない
              return false
            }
          }
        }
      })
    ]
  }
})
