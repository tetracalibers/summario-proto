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
        {/* <HeadingButton editor={editor} level={2} hideWhenUnavailable={true} showShortcut={true} /> */}
        {/* <HeadingButton editor={editor} level={3} hideWhenUnavailable={true} showShortcut={true} />
        <HeadingButton editor={editor} level={4} hideWhenUnavailable={true} showShortcut={true} /> */}
        {/* <ListButton
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
        /> */}
        {/* <CodeBlockButton editor={editor} hideWhenUnavailable={true} showShortcut={true} /> */}
        <LinkPopover editor={editor} hideWhenUnavailable={false} autoOpenOnLinkActive={true} />
        <button
          type="button"
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 2 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 2 }).run()
            }
          }}
        >
          h2
        </button>
        <button
          type="button"
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 3 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 3 }).run()
            }
          }}
        >
          h3
        </button>
        <button
          type="button"
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("heading", { level: 4 })) {
              chain.setParagraph().run()
            } else {
              chain.setHeading({ level: 4 }).run()
            }
          }}
        >
          h4
        </button>
        <button
          type="button"
          onClick={() => {
            const chain = editor.chain().focus()
            if (editor.isActive("bulletList")) {
              chain.toggleOrderedList()
            } else {
              chain.toggleBulletList()
            }
            chain.run()
          }}
        >
          Toggle List Type
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Toggle Code Block
        </button>
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
