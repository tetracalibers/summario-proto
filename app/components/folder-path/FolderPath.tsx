import { IconFolder } from "@tabler/icons-react"
import styles from "./FolderPath.module.css"
import { useTermPath } from "~/queries/term-path/ui.hooks"

interface Props {
  termId: number
  initialPath?: { id: number; name: string }[]
}

export default function FolderPath({ termId, initialPath }: Props) {
  const { paths } = useTermPath(termId, initialPath ?? [])

  return paths.length > 0 ? (
    <ul className={styles.list}>
      {paths.map((folder) => (
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
