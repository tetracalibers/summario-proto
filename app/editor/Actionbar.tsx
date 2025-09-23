import type { Editor } from "@tiptap/react"
import { CodeBlockButton } from "~/components/tiptap-ui/code-block-button"
import { HeadingButton } from "~/components/tiptap-ui/heading-button"
import { LinkPopover } from "~/components/tiptap-ui/link-popover"
import { ListButton } from "~/components/tiptap-ui/list-button"
import { Toolbar } from "~/components/tiptap-ui-primitive/toolbar"
import { Button } from "~/components/tiptap-ui-primitive/button"

interface Props {
  editor: Editor
}

const EditorActionbar = ({ editor }: Props) => {
  return (
    <Toolbar>
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
      <Button
        type="button"
        onClick={() => {
          const $sectionBlocks = editor.$nodes("sectionBlock")
          if (!$sectionBlocks) {
            editor.chain().focus().toggleWrap("sectionBlock").run()
            return
          }

          const activeNodePos = editor.state.selection.$head
          const activeSectionBlock = $sectionBlocks.find((node) => {
            return (
              activeNodePos.pos >= node.pos && activeNodePos.pos <= node.pos + node.node.nodeSize
            )
          })
          if (!activeSectionBlock) {
            editor.chain().focus().toggleWrap("sectionBlock").run()
            return
          }

          const from = activeSectionBlock.pos + 1
          const to = activeSectionBlock.pos + activeSectionBlock.node.nodeSize - 1

          for (let i = from; i <= to; i++) {
            editor.chain().focus(i).toggleWrap("sectionBlock").run()
          }
        }}
      >
        Toggle Group
      </Button>
    </Toolbar>
  )
}

export default EditorActionbar
