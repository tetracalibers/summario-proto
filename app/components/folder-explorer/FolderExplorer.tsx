import { NavLink } from "react-router"
import FileLink from "./FileLink"
import FolderLink from "./FolderLink"
import styles from "./FolderExplorer.module.css"

interface Props {
  currentTermId: string
  currentFolder: {
    name: string
    parentId: number | null
    isRoot: boolean
  } | null
  items: {
    id: number | string
    name: string
    fullPath: string
    parentId: number | null
    type: "folder" | "file"
  }[]
}

export default function FolderExplorer({ currentTermId, currentFolder, items }: Props) {
  return (
    <div className={styles.root}>
      <div>{currentFolder?.name ?? "(root)"}</div>
      {currentFolder && !currentFolder.isRoot && (
        <NavLink
          to={`/terms/${currentTermId}${currentFolder.parentId ? `?dir=${currentFolder.parentId}` : ""}`}
          style={{ textDecoration: "none", color: "inherit" }}
          viewTransition
        >
          <pre>cd ..</pre>
        </NavLink>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${item.type}-${item.id}`}>
            {item.type === "folder" ? (
              <FolderLink currentTermId={currentTermId} folderId={item.id} folderName={item.name} />
            ) : (
              <FileLink targetTerm={item} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
