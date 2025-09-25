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
  const activeNodePos = editor.state.selection.$head
  const activeNode = activeNodePos.parent

  if (activeNode.type.name === "title_block") {
    return
  }

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
