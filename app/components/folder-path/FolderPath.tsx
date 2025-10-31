import { IconFolder } from "@tabler/icons-react"
import styles from "./FolderPath.module.css"

interface Props {
  folders: { id: number; name: string }[]
}

export default function FolderPath({ folders }: Props) {
  return folders.length > 0 ? (
    <ul className={styles.list}>
      {folders.map((folder) => (
        <li key={folder.id} className={styles.list_item}>
          <div className={styles.item_inner}>
            <IconFolder size={12} />
            <span className={styles.item_title}>{folder.name}</span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className={styles.item_inner}>
      <IconFolder size={12} />
      <pre className={styles.item_title}>(No Folder)</pre>
    </div>
  )
}
