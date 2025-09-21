import { type Editor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import { useCallback, useState } from "react"
import LinkModal from "./LinkModal"
import { useDisclosure } from "@mantine/hooks"

interface Props {
  editor: Editor
}

const EditorMenu = ({ editor }: Props) => {
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
    <>
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

      <LinkModal
        url={url}
        opened={opened}
        close={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </>
  )
}

export default EditorMenu
