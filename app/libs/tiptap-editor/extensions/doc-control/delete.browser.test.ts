import "../../test-utils/mock.css"

import { beforeEach, describe, expect, it } from "vitest"
import { renderTiptapEditor } from "../../test-utils/renderTiptapEditor"
import StarterKit from "@tiptap/starter-kit"
import { SectionBlockNode } from "../section-block/extension"
import { TitleBlockNode } from "../title-block/extension"
import Document from "@tiptap/extension-document"
import { CustomDocumentControl } from "./extension"
import { cleanup } from "@testing-library/react"
import { getBlockEndPos, getBlockStartPos } from "../../test-utils/pos"

const CustomDocument = Document.extend({
  content: "title? (section|block)*"
})

const extensions = [
  CustomDocument,
  CustomDocumentControl,
  StarterKit.configure({ document: false, trailingNode: false }),
  SectionBlockNode,
  TitleBlockNode
]

describe("CustomDocumentControl.deleteBlock", () => {
  beforeEach(() => cleanup())

  it("選択範囲の削除：先頭からの範囲選択", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: "<p>head</p><p>middle</p><p>tail</p>",
      setUpEditor(editor) {
        // 先頭ブロック開始〜2ブロック目末尾までを選択
        const from = 0 // doc の最初のテキスト位置
        const to = getBlockEndPos(editor.state.doc, 1)
        editor.chain().focus().setTextSelection({ from, to }).run()
      }
    })

    const ok = editor.chain().focus().deleteBlock().run()
    expect(ok).toBe(true)

    // 先頭2ブロックが消え、残るのは "tail" の段落だけ
    expect(editor.getText().trim()).toBe("tail")
  })

  it("選択範囲の削除：非先頭からの範囲選択", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>one</p><p>two</p><p>three</p>`,
      setUpEditor(editor) {
        // 2ブロック目開始〜3ブロック目末尾
        const from = getBlockStartPos(editor.state.doc, 1)
        const to = getBlockEndPos(editor.state.doc, 2)
        editor.chain().focus().setTextSelection({ from, to }).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getText().trim()).toBe("one")
  })

  it("選択範囲の削除：テキストの途中からの範囲選択", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>one</p><p>two</p><p>three</p>`,
      setUpEditor(editor) {
        // 2ブロック目の途中から3ブロック目末尾
        const from = getBlockStartPos(editor.state.doc, 1) + 1
        const to = getBlockEndPos(editor.state.doc, 2)
        editor.chain().focus().setTextSelection({ from, to }).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<p>one</p><p>t</p>")
  })

  it("トップタイトル：コンテンツのクリアのみ", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<title-block>Document Title</title-block><p>Some content here.</p>`,
      setUpEditor(editor) {
        // タイトルブロック内にキャレット
        const titleBlockStart = getBlockStartPos(editor.state.doc, 0)
        const pos = titleBlockStart + 5 // タイトルの途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<h1></h1><p>Some content here.</p>")
  })

  it("トップレベルのノード：そのまま削除", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `<p>Paragraph 1</p><p>Paragraph 2</p>`,
      setUpEditor(editor) {
        // 2番目の段落にキャレット
        const paragraph2Start = getBlockStartPos(editor.state.doc, 1)
        const pos = paragraph2Start + 2 // 段落の途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<p>Paragraph 1</p>")

    // カーソルは前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("Paragraph 1") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("リスト内：listItem 単位で削除される（他の item は存続）", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: "<ul><li><p>Item 1</p></li><li><p>Item 2</p></li><li><p>Item 3</p></li></ul>",
      setUpEditor(editor) {
        // 2番目のリストアイテム内にキャレット
        const list = editor.state.doc.child(0)
        const item2Start = getBlockStartPos(list, 1)
        const pos = item2Start + 5 // 2番目のリストアイテム内の途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.chain().focus().deleteBlock().run()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<ul><li><p>Item 1</p></li><li><p>Item 3</p></li></ul>")

    // カーソルは前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("Item 1") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("blockquote内：blockquoteごと削除される", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content:
        "<p>Normal paragraph 1</p><blockquote><p>Quote 1</p></blockquote><p>Normal paragraph 2</p>",
      setUpEditor(editor) {
        // blockquote内にキャレット
        const quoteStart = getBlockStartPos(editor.state.doc, 1)
        const pos = quoteStart + 2 // blockquote内のpの途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<p>Normal paragraph 1</p><p>Normal paragraph 2</p>")

    // カーソルは前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("Normal paragraph 1") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("section_block内：子が複数ある場合は現在のノードだけ削除", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: {
        type: "doc",
        content: [
          {
            type: "section_block",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "Child 1" }] },
              { type: "paragraph", content: [{ type: "text", text: "Child 2" }] },
              { type: "paragraph", content: [{ type: "text", text: "Child 3" }] }
            ]
          }
        ]
      },
      setUpEditor(editor) {
        // 2番目の子ノード内にキャレット
        const section = editor.state.doc.child(0)
        const child2Start = getBlockStartPos(section, 1)
        const pos = child2Start + 5 // 2番目の子ノード内の途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "section_block",
          content: [
            { type: "paragraph", content: [{ type: "text", text: "Child 1" }] },
            { type: "paragraph", content: [{ type: "text", text: "Child 3" }] }
          ]
        }
      ]
    })

    // カーソルはsection_block内の削除されたノードの前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("Child 1") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("section_block内：子が1つだけの場合はセクションブロックごと削除", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "before section_block" }]
          },
          {
            type: "section_block",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Only Child" }] }]
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "after section_block" }]
          }
        ]
      },
      setUpEditor(editor) {
        // section_block内の唯一の子ノードにキャレット
        const sectionStart = getBlockStartPos(editor.state.doc, 1)
        const pos = sectionStart + 5 // 子ノードの途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<p>before section_block</p><p>after section_block</p>")

    // カーソルは前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("before section_block") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("section_block内：子が複数、最後のノード", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "before section_block" }]
          },
          {
            type: "section_block",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "Child 1" }] },
              { type: "paragraph", content: [{ type: "text", text: "Child 2" }] }
            ]
          }
        ]
      },
      setUpEditor(editor) {
        // section_block内の最後の子ノードにキャレット
        const section = editor.state.doc.child(1)
        const child2Start = getBlockStartPos(editor.state.doc, 1) + section.child(0).nodeSize
        const pos = child2Start + 3 // 子ノードの途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "before section_block" }]
        },
        {
          type: "section_block",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Child 1" }] }]
        }
      ]
    })

    // カーソルはsection_block内の最後のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("Child 1") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("section_block内：子が1つ、最後のノード", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "before section_block 1" }] },
          { type: "paragraph", content: [{ type: "text", text: "before section_block 2" }] },
          {
            type: "section_block",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Only Child" }] }]
          }
        ]
      },
      setUpEditor(editor) {
        // section_block内の唯一の子ノードにキャレット
        const sectionStart = getBlockStartPos(editor.state.doc, 2)
        const pos = sectionStart + 5 // 子ノードの途中
        editor.chain().focus(pos).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getHTML()).toBe("<p>before section_block 1</p><p>before section_block 2</p>")

    // カーソルは最後のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("before section_block 2") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })

  it("section_block内：子が1つ、最後のノード、末尾にカーソル", async () => {
    const { editor } = await renderTiptapEditor({
      extensions,
      content: `
        <p>before section_block</p>
        <section-block>
          <ul>
            <li><p>section_block 1 - list item 1</p></li>
            <li><p>section_block 1 - list item 2</p></li>
          </ul>
        </section-block>
        <section-block>
          <h2>section_block 2</h2>
        </section-block>
      `,
      setUpEditor(editor) {
        editor.chain().focus(editor.state.doc.content.size).run()
      }
    })

    const ok = editor.commands.deleteBlock()
    expect(ok).toBe(true)
    expect(editor.getJSON()).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "before section_block" }]
        },
        {
          type: "section_block",
          content: [
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "section_block 1 - list item 1" }]
                    }
                  ]
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "section_block 1 - list item 2" }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })

    // カーソルは前のノードの末尾に移動していることを確認
    const nodeAt = editor.state.doc.nodeAt(editor.state.selection.from - 1)
    expect(nodeAt!.textContent).toBe("section_block 1 - list item 2") // 段落のテキスト内容確認
    // 段落末尾位置確認
    const nodeStart = editor.state.selection.from - nodeAt!.nodeSize + 1
    const nodeEnd = nodeStart + nodeAt!.nodeSize - 1
    expect(editor.state.selection.from).toBe(nodeEnd)
  })
})
