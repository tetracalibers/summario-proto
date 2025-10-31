import { type Editor } from "@tiptap/react"
import { RichTextEditor } from "@mantine/tiptap"
import { IconSection, IconTrash, IconSourceCode } from "@tabler/icons-react"
import styles from "./Actionbar.module.css"

interface Props {
  editor: Editor | null
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <RichTextEditor.Toolbar sticky className={styles.toolbar}>
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
          onClick={() => editor?.commands.deleteBlock()}
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
