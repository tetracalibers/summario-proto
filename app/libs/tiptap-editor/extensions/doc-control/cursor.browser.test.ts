import "../../test-utils/mock.css"

import { cleanup } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { renderTiptapEditor } from "../../test-utils/renderTiptapEditor"
import StarterKit from "@tiptap/starter-kit"
import { CustomDocumentControl } from "./extension"
import { getBlockEndPos, getBlockStartPos } from "../../test-utils/pos"

const extensions = [StarterKit.configure({ trailingNode: false }), CustomDocumentControl]

describe("CustomDocumentControl.setCursorToPrevNodeEnd", () => {
  beforeEach(() => cleanup())

  it("textOffset>0 の場合は何もしない（カーソル位置不変）", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: "<p>abc</p><p>def</p>",
      setUpEditor(editor) {
        // 2段落目 "def" の "e" 上（途中=offset>0想定）にキャレット
        // 2段落目の開始絶対位置を軽く計算して、+2（"de"の位置）
        const para2Start = getBlockEndPos(editor.state.doc, 0) + 2 // 1段落目末尾の次＝2段落目開始
        const pos = para2Start + 1 // "e" の位置想定
        editor.chain().focus(pos).run()
      }
    })

    const before = editor.state.selection
    // textOffset>0 を想定して明示的に引数1で呼ぶ
    const ok = editor.commands.setCursorToPrevNodeEnd(1)
    const after = editor.state.selection

    expect(ok).toBe(true)
    expect(after.from).toBe(before.from)
    expect(after.to).toBe(before.to)
  })

  it("ドキュメント最初のノード内では何もしない", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: "<p>first</p><p>second</p>",
      setUpEditor(editor) {
        // 1段落目の任意位置にキャレット
        const para1Start = 1 // ルート直後（<doc>の最初）
        const pos = para1Start + 1 // "f"あたり
        editor.chain().focus(pos).run()
      }
    })

    const before = editor.state.selection
    const ok = editor.commands.setCursorToPrevNodeEnd(0)
    const after = editor.state.selection

    expect(ok).toBe(true)
    expect(after.from).toBe(before.from)
  })

  it("一般ケース：直前の兄弟ノード末尾に移動する", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: "<p>aaa</p><p>bbb</p><p>ccc</p>",
      setUpEditor(editor) {
        // 3段落目先頭にキャレット
        const para3Start = getBlockStartPos(editor.state.doc, 2)
        editor.chain().focus(para3Start).run()
      }
    })

    const ok = editor.chain().focus().setCursorToPrevNodeEnd().run()
    expect(ok).toBe(true)

    // 期待：2段落目の末尾
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("bbb") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })
})
