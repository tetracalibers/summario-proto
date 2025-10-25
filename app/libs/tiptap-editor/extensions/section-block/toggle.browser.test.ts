import "../../test-utils/mock.css"

import { cleanup } from "@testing-library/react"
import StarterKit from "@tiptap/starter-kit"
import { beforeEach, describe, expect, it } from "vitest"
import { SectionBlockNode } from "./extension"
import Document from "@tiptap/extension-document"
import { renderTiptapEditor } from "../../test-utils/renderTiptapEditor"
import type { Editor } from "@tiptap/react"

const CustomDocument = Document.extend({
  content: "(section|block)*"
})

const extensions = [
  CustomDocument,
  StarterKit.configure({ document: false, trailingNode: false }),
  SectionBlockNode
]

// 「doc(paragraph(..), paragraph(..))」のような素朴な構成を前提に、
// n番目のブロックノードの終端絶対位置を返す（1-based index）
function getBlockEndPos(editor: Editor, n: number) {
  const doc = editor.state.doc
  let pos = 1 // doc の最初の子の直前
  for (let i = 0; i < n; i++) {
    pos += doc.child(i).nodeSize
  }
  return pos - 1 // n番目ノードの末尾位置
}

/** ブロック n(1-based) の開始絶対位置 */
function getBlockStartPos(editor: Editor, n: number) {
  const doc = editor.state.doc
  let pos = 0
  let count = 0
  doc.descendants((node, posHere) => {
    if (node.isBlock) {
      count += 1
      if (count === n) {
        pos = posHere
        return false
      }
    }
    return true
  })
  return pos
}

describe("SectionBlockNode.toggleSectionBlock", () => {
  beforeEach(() => cleanup())

  it("section_blockが1つも存在しない：現在の選択範囲をsection_blockでラップ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>target</p><p>outside</p>`,
      setUpEditor(editor) {
        // 1段落目の先頭にキャレット
        const p1Start = getBlockStartPos(editor, 1)
        editor
          .chain()
          .focus(p1Start + 1)
          .run()
      }
    })

    const ok = editor.commands.toggleSectionBlock()
    expect(ok).toBe(true)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "section_block",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "target" }]
            }
          ]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "outside" }]
        }
      ]
    })
  })

  it("section_blockの外で実行：選択範囲をsection_blockでラップ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>outside</p><p>target</p><section-block><p>inside</p></section-block>`,
      setUpEditor(editor) {
        // 2段落目の先頭にキャレット
        const p2Start = getBlockStartPos(editor, 2)
        editor
          .chain()
          .focus(p2Start + 1)
          .run()
      }
    })

    const ok = editor.commands.toggleSectionBlock()
    expect(ok).toBe(true)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "outside" }]
        },
        {
          type: "section_block",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "target" }]
            }
          ]
        },
        {
          type: "section_block",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "inside" }]
            }
          ]
        }
      ]
    })
  })

  it("section_blockの中で実行：子コンテンツ全体を選択してアンラップ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>outside 1</p><section-block><p>inside 1</p><p>inside 2</p></section-block><p>outside 2</p>`,
      setUpEditor(editor) {
        const prevEnd = getBlockEndPos(editor, 1)
        const sectionStart = prevEnd + 1
        // section_block内の先頭にキャレット
        editor
          .chain()
          .focus(sectionStart + 1)
          .run()
      }
    })

    const ok = editor.commands.toggleSectionBlock()
    expect(ok).toBe(true)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "outside 1" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "inside 1" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "inside 2" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "outside 2" }]
        }
      ]
    })
  })

  it("範囲選択で実行：選択範囲全体を1つのsection_blockでラップ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>target 1</p><p>target 2</p><p>outside</p>`,
      setUpEditor(editor) {
        const from = getBlockStartPos(editor, 1) // p1開始
        const to = getBlockEndPos(editor, 2) // p2終端まで
        editor.chain().focus().setTextSelection({ from, to }).run()
      }
    })

    const ok = editor.commands.toggleSectionBlock()
    expect(ok).toBe(true)

    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "section_block",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "target 1" }]
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "target 2" }]
            }
          ]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "outside" }]
        }
      ]
    })
  })
})
