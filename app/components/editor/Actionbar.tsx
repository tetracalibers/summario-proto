import { findParentNodeClosestToPos, type Editor } from "@tiptap/react"
import { RichTextEditor } from "@mantine/tiptap"
import { IconSection, IconTrash, IconSourceCode } from "@tabler/icons-react"

const deleteBlock = (editor: Editor) => {
  const { $from, $to } = editor.state.selection

  // 範囲選択されているときはその範囲を削除
  if ($from.pos !== $to.pos) {
    // ドキュメントの最初のノードが選択されている場合、deleteSelection()ではエラーになる…
    if ($from.pos === 1) {
      const range = { from: $from.pos + 1, to: $to.pos }
      editor.chain().focus().deleteRange(range).setCursorToPrevNodeEnd($from.textOffset).run()
      return
    }

    editor.chain().focus().deleteSelection().setCursorToPrevNodeEnd($from.textOffset).run()
    return
  }

  const activeNodePos = $from
  const activeNode = activeNodePos.parent

  // トップタイトルはコンテンツのクリアのみ
  if (activeNode.type.name === "title_block") {
    editor.chain().focus().clearTitleContent().run()
    return
  }

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

  if (editor.isActive("sectionBlock")) {
    const activeSectionBlock = findParentNodeClosestToPos(
      activeNodePos,
      (node) => node.type.name === "sectionBlock"
    )
    if (!activeSectionBlock) return

    // 子が複数ある場合は現在のノードだけ削除
    if (activeSectionBlock.node.childCount > 1) {
      editor.chain().focus().deleteNode(activeNode.type.name).setCursorToPrevNodeEnd().run()
      return
    }

    // 子が1つだけの場合はセクションブロックごと削除
    editor.chain().focus().deleteSectionBlock().setCursorToPrevNodeEnd().run()
    return
  }
}

interface Props {
  editor: Editor | null
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <RichTextEditor.Toolbar sticky pt={0}>
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
          onClick={() => editor?.commands.toggleSectionBlock()}
          aria-label="toggle section"
          title="Toggle section"
        >
          <IconSection stroke={1.5} size={16} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          onClick={() => deleteBlock(editor!)}
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
