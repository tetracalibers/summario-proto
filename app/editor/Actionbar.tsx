import type { Editor } from "@tiptap/react"
import { ButtonGroup } from "~/components/tiptap-ui-primitive/button"
import { CodeBlockButton } from "~/components/tiptap-ui/code-block-button"
import { HeadingButton } from "~/components/tiptap-ui/heading-button"
import { ListButton } from "~/components/tiptap-ui/list-button"

interface Props {
  editor: Editor
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <>
      <ButtonGroup orientation="horizontal">
        <HeadingButton editor={editor} level={2} hideWhenUnavailable={true} showShortcut={true} />
        <HeadingButton editor={editor} level={3} hideWhenUnavailable={true} showShortcut={true} />
        <HeadingButton editor={editor} level={4} hideWhenUnavailable={true} showShortcut={true} />
        <ListButton
          editor={editor}
          type="bulletList"
          hideWhenUnavailable={true}
          showShortcut={true}
        />
        <ListButton
          editor={editor}
          type="orderedList"
          hideWhenUnavailable={true}
          showShortcut={true}
        />
        <ListButton
          editor={editor}
          type="taskList"
          hideWhenUnavailable={true}
          showShortcut={true}
        />
        <CodeBlockButton editor={editor} hideWhenUnavailable={true} showShortcut={true} />
      </ButtonGroup>
    </>
  )
}

export default EditorActionbar
