import { useEditor } from "@tiptap/react"
import { RichTextEditor } from "@mantine/tiptap"
import EditorActionbar from "~/components/editor/Actionbar"
import DragHandle from "@tiptap/extension-drag-handle-react"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import { AppShell, Burger, Grid, ScrollArea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import FolderTree from "~/components/folder-tree/FolderTree"
import { dummyFolderData, dummyEditorContent } from "~/db/dummy"
import { createSectionBlockJson } from "~/extensions/section-block/helper"
import { tiptapExtensions } from "~/components/editor/extensions"

const TiptapEditor = () => {
  const [opened, { toggle }] = useDisclosure(true)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: tiptapExtensions,
    editorProps: {
      handleDrop: (view, event, _slice, _moved) => {
        if (!editor) return false

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
            .insertContentAt(
              droppedPoint.pos,
              createSectionBlockJson(blockInfo.type, blockInfo.label)
            )
            .run()

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
    content: dummyEditorContent
  })

  if (!editor) return null

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header p={"md"}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Summario</div>
      </AppShell.Header>
      <AppShell.Navbar p={"md"}>
        <ScrollArea>
          <FolderTree data={dummyFolderData} />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                  />
                </svg>
              </DragHandle>
              <RichTextEditor.Content />
            </RichTextEditor>
          </Grid.Col>
          <Grid.Col span={3}>
            <ScrollArea h={"calc(100vh - 10rem)"} pb={"md"}>
              <BlockTypeMenu />
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  )
}

export default TiptapEditor
