import React from "react"
import { Modal } from "@mantine/core"

interface IProps {
  opened: boolean
  close: () => void
  url: string
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSaveLink: (e: React.MouseEvent<HTMLButtonElement>) => void
  onRemoveLink: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function LinkModal(props: IProps) {
  const { opened, close, url, onChangeUrl, onSaveLink, onRemoveLink } = props
  return (
    <Modal opened={opened} onClose={close}>
      <h2>リンクを編集</h2>
      <input name="url" type="text" placeholder="リンクを入力" value={url} onChange={onChangeUrl} />
      <div>
        <button onClick={onRemoveLink}>
          <p>リンクを削除する</p>
        </button>
        <button onClick={onSaveLink}>
          <p>リンクを保存する</p>
        </button>
      </div>
    </Modal>
  )
}
