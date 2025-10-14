import { IconFolder } from "@tabler/icons-react"
import styles from "./FolderPath.module.css"

interface Props {
  folders: { id: number; name: string }[]
}

export default function FolderPath({ folders }: Props) {
  return (
    <ul className={styles.list}>
      {folders.map((folder) => (
        <li key={folder.id} className={styles.list_item}>
          <span className={styles.item_inner}>
            <IconFolder size={12} />
            <span className={styles.item_title}>{folder.name}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
