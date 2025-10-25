import "../../test-utils/mock.css"

import { StarterKit } from "@tiptap/starter-kit"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { SectionBlockNode } from "../section-block/extension"
import { DropSectionBlock } from "./extension"
import { renderTiptapEditor } from "../../test-utils/renderTiptapEditor"
import type { Editor } from "@tiptap/react"
import Document from "@tiptap/extension-document"
import { createSectionBlockJson } from "../../utils"
import { cleanup } from "@testing-library/react"
import { BLOCK_TITLE_MIME } from "../../constants"

const CustomDocument = Document.extend({
  content: "(section|block)*"
})

const extensions = [
  CustomDocument,
  StarterKit.configure({ document: false, trailingNode: false }),
  SectionBlockNode,
  DropSectionBlock
]

// Create a DragEvent with a writable dataTransfer in real browsers
function makeDragEvent(type: string, opts: { x?: number; y?: number; title?: string } = {}) {
  const { x = 10, y = 10, title } = opts
  const ev = new DragEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y })
  const dt = new DataTransfer()
  if (title != null) dt.setData(BLOCK_TITLE_MIME, title)
  Object.defineProperty(ev, "dataTransfer", { value: dt })
  return ev
}

// Mock `view.posAtCoords` to control the plugin branch
function mockPosAtCoords(editor: Editor, ret: { pos: number; inside: number } | null) {
  const view = editor.view as any
  return vi.spyOn(view, "posAtCoords").mockImplementation((_coords: any) => ret)
}

// ヘルパー: 任意のトップレベルノード index の直後ギャップ位置を計算
function posAfterTopLevel(editor: Editor, index: number) {
  const doc = editor.state.doc
  let pos = 1 // doc の最初の子の直前
  for (let i = 0; i <= index; i++) {
    pos += doc.child(i).nodeSize
  }
  return pos // index 番目ノードの直後ギャップ
}

describe("DropSectionBlock", () => {
  beforeEach(() => cleanup())

  it("ブロック間への挿入（先頭）", async () => {
    const initialJsonContent = [
      { type: "paragraph", content: [{ type: "text", text: "para1" }] },
      { type: "paragraph", content: [{ type: "text", text: "para2" }] }
    ]

    const { editor } = await renderTiptapEditor({
      content: { type: "doc", content: initialJsonContent },
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // posAtCoords をモックして、先頭ノード前のギャップ位置を返すようにする
    const gapPos = posAfterTopLevel(editor, -1) // 先頭ノード前ギャップ
    const spy = mockPosAtCoords(editor, { pos: gapPos, inside: 0 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [createSectionBlockJson("My Section"), ...initialJsonContent]
    })

    spy.mockRestore()
  })

  it("ブロック間への挿入（中間）", async () => {
    const initialJsonContent = [
      { type: "paragraph", content: [{ type: "text", text: "para1" }] },
      { type: "paragraph", content: [{ type: "text", text: "para2" }] }
    ]

    const { editor } = await renderTiptapEditor({
      content: { type: "doc", content: initialJsonContent },
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // posAtCoords をモックして、1番目ノード後のギャップ位置を返すようにする
    const gapPos = posAfterTopLevel(editor, 0) // 1番目ノード後ギャップ
    const spy = mockPosAtCoords(editor, { pos: gapPos, inside: 0 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [initialJsonContent[0], createSectionBlockJson("My Section"), initialJsonContent[1]]
    })

    spy.mockRestore()
  })

  it("ブロック間への挿入（文末の直前ギャップ）", async () => {
    const initialJsonContent = [
      { type: "paragraph", content: [{ type: "text", text: "para1" }] },
      { type: "paragraph", content: [{ type: "text", text: "para2" }] }
    ]

    const { editor } = await renderTiptapEditor({
      content: { type: "doc", content: initialJsonContent },
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // 文書末尾直前のギャップ: doc.content.size を pos に用いる
    const endGap = editor.state.doc.content.size
    const spy = mockPosAtCoords(editor, { pos: endGap, inside: -1 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [...initialJsonContent, createSectionBlockJson("My Section")]
    })

    spy.mockRestore()
  })

  it("テキストノード内にドロップした場合は何もしない", async () => {
    const initialJson = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }]
    }
    const pos = 2

    const { editor } = await renderTiptapEditor({
      content: initialJson,
      extensions,
      setUpEditor: (editor) => editor.chain().focus().setTextSelection(pos).run()
    })

    // inside>0 を満たす任意の座標。nodeAt(pos-1) を text にモック。
    const spy = mockPosAtCoords(editor, { pos, inside: 1 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    // コンテンツが変化していないこと
    expect(editor.getJSON()).toEqual(initialJson)

    spy.mockRestore()
  })

  it("空のトップレベル段落は置き換えられる", async () => {
    const firstParagraphJsonContent = { type: "paragraph", content: [{ type: "text", text: "A" }] }

    const { editor } = await renderTiptapEditor({
      content: { type: "doc", content: [firstParagraphJsonContent, { type: "paragraph" }] },
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // 2番目の空段落の位置を返すようにモック
    const posInSecond = editor.state.doc.child(0).nodeSize + 1
    const spy = mockPosAtCoords(editor, { pos: posInSecond, inside: 1 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [firstParagraphJsonContent, createSectionBlockJson("My Section")]
    })

    spy.mockRestore()
  })

  it("ネスト配下の段落 (depth>1) は挿入しない ", async () => {
    const initialJson = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [{ type: "paragraph" }]
        },
        { type: "paragraph", content: [{ type: "text", text: "top" }] }
      ]
    }

    const { editor } = await renderTiptapEditor({
      content: initialJson,
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // ネスト内の座標（inside>0）を想定
    const pos = editor.state.doc.child(0).content.firstChild!.nodeSize
    const spy = mockPosAtCoords(editor, { pos, inside: 2 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual(initialJson)

    spy.mockRestore()
  })

  it("blockquoteなど他のノード内には挿入しない", async () => {
    const initialJson = {
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [{ type: "paragraph", content: [{ type: "text", text: "inside blockquote" }] }]
        },
        { type: "paragraph", content: [{ type: "text", text: "p" }] }
      ]
    }

    const { editor } = await renderTiptapEditor({
      content: initialJson,
      extensions,
      setUpEditor: (editor) => editor.chain().focus().run()
    })

    // blockquote内の座標（inside>0）を想定
    const spy = mockPosAtCoords(editor, { pos: 1, inside: 1 })

    const ev = makeDragEvent("drop", { title: "My Section" })
    editor.view.dom.dispatchEvent(ev)

    expect(editor.getJSON()).toEqual(initialJson)

    spy.mockRestore()
  })
})
