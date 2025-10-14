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
  isActive: boolean
}

export default function FileLink({ targetTerm, isActive }: Props) {
  const Tag = isActive ? "div" : NavLink

  return (
    <Tag
      to={`/terms/${targetTerm.id}`}
      className={clsx(styles.entry_link, styles.file_link, isActive && styles.highlight_active)}
    >
      <ItemContent label={targetTerm.name} Icon={() => <IconNote size={18} />} />
    </Tag>
  )
}
