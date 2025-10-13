import { NavLink } from "react-router"
import ItemContent from "./ItemContent"
import { IconFolder } from "@tabler/icons-react"
import styles from "./Link.module.css"

interface Props {
  currentTermId: string
  folderId: string | number
  folderName: string
}

export default function FolderLink({ currentTermId, folderId, folderName }: Props) {
  return (
    <NavLink to={`/terms/${currentTermId}?dir=${folderId}`} className={styles.link}>
      <ItemContent
        label={folderName}
        Icon={() => <IconFolder size={18} color="var(--mantine-color-bright-orange-6)" />}
      />
    </NavLink>
  )
}
