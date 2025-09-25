import type { Editor } from "@tiptap/react"
import { RichTextEditor } from "@mantine/tiptap"
import { IconSection, IconTrash, IconSourceCode } from "@tabler/icons-react"

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
  const { $from, $to } = editor.state.selection

  // 範囲選択されているときはその範囲を削除
  if ($from.pos !== $to.pos) {
    const range = { from: $from.pos === 1 ? $from.pos + 1 : $from.pos, to: $to.pos }
    editor.chain().focus().deleteRange(range).setCursorToPrevNodeEnd().run()
    return
  }

  const activeNodePos = $from
  const activeNode = activeNodePos.parent

  // トップタイトルは削除不可
  if (activeNode.type.name === "title_block") return

  // トップレベルのノードはそのまま削除
  if (activeNodePos.depth === 1) {
    editor.chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
    return
  }

  // リスト内の場合、リストアイテムごと削除
  // activeNodeはparagraphになっているが、その親であるli:has(> p)要素を削除する
  if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
    editor.chain().focus().selectParentNode().deleteSelection().setCursorToPrevNodeEnd().run()
    return
  }

  // blockquoteの場合も同様にp要素の親要素を削除する
  if (editor.isActive("blockquote")) {
    editor.chain().focus().selectParentNode().deleteSelection().setCursorToPrevNodeEnd().run()
    return
  }

  // TODO: セクションブロック内のブロックを削除した場合の挙動を考える
  if (editor.isActive("sectionBlock")) {
    editor.chain().focus().deleteSectionBlock().setCursorToPrevNodeEnd().run()
    return
  }
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
