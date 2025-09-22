import type { Editor } from "@tiptap/react"
import { ButtonGroup } from "~/components/tiptap-ui-primitive/button"
import { CodeBlockButton } from "~/components/tiptap-ui/code-block-button"
import { HeadingButton } from "~/components/tiptap-ui/heading-button"
import { LinkPopover } from "~/components/tiptap-ui/link-popover"
import { ListButton } from "~/components/tiptap-ui/list-button"

interface Props {
  editor: Editor
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <>
      <ButtonGroup orientation="horizontal">
        <LinkPopover editor={editor} hideWhenUnavailable={false} autoOpenOnLinkActive={true} />
        <HeadingButton
          editor={editor}
          level={2}
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 2 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 2 }).run()
            }
          }}
        />
        <HeadingButton
          editor={editor}
          level={3}
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 3 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 3 }).run()
            }
          }}
        />
        <HeadingButton
          editor={editor}
          level={4}
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 4 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 4 }).run()
            }
          }}
        />
        <ListButton
          editor={editor}
          type="bulletList"
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ListButton
          editor={editor}
          type="orderedList"
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <CodeBlockButton
          editor={editor}
          hideWhenUnavailable={false}
          showShortcut={true}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleWrap("sectionBlock").run()}
        >
          Toggle Section
        </button>
      </ButtonGroup>
    </>
  )
}

export default EditorActionbar
