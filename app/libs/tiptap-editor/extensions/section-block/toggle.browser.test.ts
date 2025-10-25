import "../../test-utils/mock.css"

import { cleanup } from "@testing-library/react"
import StarterKit from "@tiptap/starter-kit"
import { beforeEach, describe, expect, it } from "vitest"
import { SectionBlockNode } from "./extension"
import Document from "@tiptap/extension-document"
import { renderTiptapEditor } from "../../test-utils/renderTiptapEditor"
import { getBlockStartPos, getBlockEndPos } from "../../test-utils/pos"

const CustomDocument = Document.extend({
  content: "(section|block)*"
})

const extensions = [
  CustomDocument,
  StarterKit.configure({ document: false, trailingNode: false }),
  SectionBlockNode
]

describe("SectionBlockNode.toggleSectionBlock", () => {
  beforeEach(() => cleanup())

  it("section_blockが1つも存在しない：現在の選択範囲をsection_blockでラップ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>target</p><p>outside</p>`,
      setUpEditor(editor) {
        // 1段落目の先頭にキャレット
        const p1Start = getBlockStartPos(editor.state.doc, 0)
        editor.chain().focus(p1Start).run()
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
        const p2Start = getBlockStartPos(editor.state.doc, 1)
        editor.chain().focus(p2Start).run()
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
        // section_block内の先頭にキャレット
        const sectionBlock = editor.state.doc.child(1)
        const sectionStart =
          getBlockStartPos(editor.state.doc, 1) + getBlockStartPos(sectionBlock, 0)
        editor.chain().focus(sectionStart).run()
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
        const from = getBlockStartPos(editor.state.doc, 0) // p1開始
        const to = getBlockEndPos(editor.state.doc, 1) // p2終端まで
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
