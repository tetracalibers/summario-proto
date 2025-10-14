import { NavLink } from "react-router"
import ItemContent from "./ItemContent"
import { IconNote } from "@tabler/icons-react"
import styles from "./EntryLink.module.css"
import { clsx } from "clsx"

interface Props {
  targetTerm: {
    id: string | number
    name: string
    parentId: string | number | null
  }
}

export default function FileLink({ targetTerm }: Props) {
  return (
    <NavLink
      to={`/terms/${targetTerm.id}`}
      className={({ isActive }) =>
        clsx(styles.entry_link, styles.file_link, isActive && styles.highlight_active)
      }
      reloadDocument
    >
      <ItemContent
        label={targetTerm.name}
        Icon={() => <IconNote size={18} color="var(--mantine-color-cyan-4)" />}
      />
    </NavLink>
  )
}
