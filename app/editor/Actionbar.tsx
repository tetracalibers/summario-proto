import type { Editor } from "@tiptap/react"
import { RichTextEditor } from "@mantine/tiptap"
import { IconSection, IconTrash, IconSourceCode } from "@tabler/icons-react"
import { TextSelection } from "@tiptap/pm/state"

interface Props {
  editor: Editor
}

const toggleSectionBlock = (editor: Editor) => {
  const $sectionBlocks = editor.$nodes("sectionBlock")
  if (!$sectionBlocks) {
    editor.chain().focus().toggleWrap("sectionBlock").run()
    return
  }

  const activeNodePos = editor.state.selection.$head
  const activeSectionBlock = $sectionBlocks.find((node) => {
    return activeNodePos.pos >= node.pos && activeNodePos.pos <= node.pos + node.node.nodeSize
  })
  if (!activeSectionBlock) {
    editor.chain().focus().toggleWrap("sectionBlock").run()
    return
  }

  const from = activeSectionBlock.pos + 1
  const to = activeSectionBlock.pos + activeSectionBlock.node.nodeSize - 1

  for (let i = from; i < to; i++) {
    editor
      .chain()
      .focus(i - 1)
      .toggleWrap("sectionBlock")
      .run()
  }
}

const deleteBlock = (editor: Editor) => {
  const activeNodePos = editor.state.selection.$from
  const activeNode = activeNodePos.parent

  // トップタイトルは削除不可
  if (activeNode.type.name === "title_block") return

  // トップレベルのノードはそのまま削除
  // TODO: カーソルを前ノードの末尾に移動させる
  if (activeNodePos.depth === 1) {
    editor.chain().focus().deleteNode(activeNode.type.name).run()
    return
  }

  // リスト内の場合、リストアイテムごと削除
  // activeNodeはparagraphになっているが、その親であるli:has(> p)要素を削除する
  if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
    // 選択ノードの開始位置
    const pos = activeNodePos.before(activeNodePos.depth - 1)

    // 削除前に「直前ノード」の末尾位置を取っておく
    const prevPos = editor.state.doc.resolve(pos - 1)
    const prevNode = prevPos.nodeBefore

    // 直前ノードが存在しない場合は削除のみ実行
    if (!prevNode) {
      editor.chain().focus().selectParentNode().deleteSelection().run()
      return
    }

    editor
      .chain()
      .focus()
      .selectParentNode()
      .deleteSelection()
      // cursorを直前ノードの末尾に移動
      .setTextSelection(TextSelection.near(prevPos, -1))
      .run()
    return
  }

  // TODO: blockquoteの場合も同様にp要素の親要素を削除するようにする

  console.log(editor.isActive("sectionBlock"))

  const $sectionBlocks = editor.$nodes("sectionBlock")
  if (!$sectionBlocks) {
    editor.chain().focus().deleteNode(activeNode.type.name).run()
    return
  }

  const activeSectionBlock = $sectionBlocks.find((node) => {
    return activeNodePos.pos >= node.pos && activeNodePos.pos <= node.pos + node.node.nodeSize
  })
  if (!activeSectionBlock) {
    editor.chain().focus().deleteNode(activeNode.type.name).run()
    return
  }

  editor.chain().deleteSectionBlock().run()
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.Code />
        <RichTextEditor.ClearFormatting />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.CodeBlock icon={IconSourceCode} />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Control
          onClick={() => toggleSectionBlock(editor)}
          aria-label="toggle section"
          title="Toggle section"
        >
          <IconSection stroke={1.5} size={16} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          onClick={() => deleteBlock(editor)}
          aria-label="delete"
          title="Delete block"
        >
          <IconTrash stroke={1.5} size={16} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
  )
}

export default EditorActionbar
