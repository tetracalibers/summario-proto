// import "~/components/tiptap-node/paragraph-node/paragraph-node.scss"
// import "~/components/tiptap-node/list-node/list-node.scss"
// import "~/components/tiptap-node/heading-node/heading-node.scss"
// import "~/components/tiptap-node/blockquote-node/blockquote-node.scss"
// import "~/components/tiptap-node/code-block-node/code-block-node.scss"

import { useEditor } from "@tiptap/react"
import { RichTextEditor, Link } from "@mantine/tiptap"
import StarterKit from "@tiptap/starter-kit"
import { all, createLowlight } from "lowlight"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import EditorActionbar from "./Actionbar"
import { ListKit } from "@tiptap/extension-list"
import SectionBlock from "~/extensions/section-block/extension"
import DragHandle from "@tiptap/extension-drag-handle-react"
import { Placeholder } from "@tiptap/extensions"
import TitleBlock from "~/extensions/title-block/extension"
import Document from "@tiptap/extension-document"
import BlockTypeMenu from "./BlockTypeMenu"
import { Grid, ScrollArea } from "@mantine/core"

const newSectionBlock = (type: string, label: string) => ({
  type: "sectionBlock",
  attrs: { type },
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        {
          type: "text",
          text: label
        }
      ]
    },
    {
      type: "paragraph",
      content: []
    }
  ]
})

const CustomDocument = Document.extend({
  content: "title_block block*"
})

const lowlight = createLowlight(all)

export const TiptapEditor = () => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
        link: false,
        heading: {
          levels: [2, 3, 4]
        }
      }),
      ListKit,
      CodeBlockLowlight.configure({
        lowlight
      }),
      Link.configure({ openOnClick: false }),
      SectionBlock,
      TitleBlock,
      Placeholder.configure({
        showOnlyCurrent: false,
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === "title_block") return "Title"
          if (node.type.name === "heading") {
            return "Heading " + node.attrs.level
          }
          return "..."
        }
      })
    ],
    editorProps: {
      handleDrop: (view, event, _slice, _moved) => {
        const block = event.dataTransfer?.getData("application/x-block")
        if (!block) return false // TipTapのデフォルトの挙動に任せる

        // dropされた位置
        const droppedPoint = view.posAtCoords({ left: event.clientX, top: event.clientY })
        if (!droppedPoint) return false

        // dropされた位置にある要素
        // nodeの間にdropされた場合はnullになるが、その場合は最後に処理するのでnullでも弾かない
        const droppedNode = view.state.doc.nodeAt(droppedPoint.pos - 1)

        // テキストの途中にdropされた場合は何もしない
        // resolveでエラーになってしまうため、ここで弾く
        if (droppedNode?.type.name === "text") return false
        // セクションブロックの中には入れない
        if (droppedNode?.type.name === "sectionBlock") return false

        // depthを調べるためにNodePosに変換
        const droppedNodePos = view.state.doc.resolve(droppedPoint.pos)

        const blockInfo = JSON.parse(block)

        // トップレベルのparagraphにdropされた場合は置き換える
        if (droppedNode?.type.name === "paragraph" && droppedNodePos.depth === 1) {
          editor
            .chain()
            .deleteNode("paragraph")
            .insertContentAt(droppedPoint.pos, newSectionBlock(blockInfo.type, blockInfo.label))
            .run()

          return true // TipTapのデフォルトのドロップ処理を停止
        }

        // paragraph以外のnodeにdropされた場合は何もしない
        if (droppedNodePos.depth > 0) return false

        // nodeの間にdropされた場合はその位置に挿入
        editor.commands.insertContentAt(
          droppedPoint.pos,
          newSectionBlock(blockInfo.type, blockInfo.label)
        )

        return true
      }
    },
    content: `
    <title-block></title-block>
    <p></p>
    <section-block type="summary">
      <h2>Summary</h2>
      <p></p>
    </section-block>
    <section-block>
      <h2>Context</h2>
      <p></p>
    </section-block>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `
  })

  return (
    <Grid>
      <Grid.Col span="auto">
        <RichTextEditor editor={editor}>
          <EditorActionbar editor={editor} />
          <DragHandle editor={editor}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </DragHandle>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Grid.Col>
      <Grid.Col span={3}>
        <ScrollArea h={"calc(100vh - 10rem)"} px={"md"} pb={"md"}>
          <BlockTypeMenu />
        </ScrollArea>
      </Grid.Col>
    </Grid>
  )
}

export default TiptapEditor
