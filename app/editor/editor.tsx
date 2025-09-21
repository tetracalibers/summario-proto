import "~/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "~/components/tiptap-node/list-node/list-node.scss"

import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useState } from "react"
import LinkModal from "./LinkModal"
import { useDisclosure } from "@mantine/hooks"

export const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit], // define your extension array
    content: "<p>Hello World!</p>" // initial content
  })

  const [opened, { close, open }] = useDisclosure(false)
  const [url, setUrl] = useState<string>("")

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href)
    open()
  }, [editor])

  const closeModal = useCallback(() => {
    close()
    setUrl("")
  }, [close])

  const saveLink = useCallback(() => {
    // urlに値が入ってる場合はリンクを設定
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run() // chainで設定したコマンドを実行
    } else {
      // urlに値が入ってない場合はリンクを削除
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    }
    editor.commands.blur()
    closeModal()
  }, [editor, url, closeModal])

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    closeModal()
  }, [editor, closeModal])

  return (
    <div>
      {/* 文字列選択時に表示されるメニュー */}
      <BubbleMenu editor={editor} shouldShow={({ from, to }) => from !== to}>
        <button onClick={openModal}>URL</button>
      </BubbleMenu>

      {/* リンク選択時に表示されるメニュー */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ from, to, editor }) => from === to && editor.isActive("link")}
      >
        <button onClick={openModal}>Edit</button>
        <button onClick={() => window.open(editor.getAttributes("link").href)}>Open</button>
      </BubbleMenu>

      {/* エディタ本体 */}
      <EditorContent editor={editor} />

      <LinkModal
        url={url}
        opened={opened}
        close={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </div>
  )
}

export default TiptapEditor
