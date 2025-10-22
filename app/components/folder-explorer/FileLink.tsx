import { NavLink } from "react-router"
import { IconNote } from "@tabler/icons-react"
import styles from "./EntryLink.module.css"
import { clsx } from "clsx"
import { useTermTitleState } from "~/units/term/ui.hooks"

interface Props {
  targetTerm: {
    id: string | number
    name: string
  }
  isActive: boolean
}

export default function FileLink({ targetTerm, isActive }: Props) {
  const { termTitle: activeTermTitle } = useTermTitleState()

  const Tag = isActive ? "div" : NavLink

  return (
    <Tag
      to={`/terms/${targetTerm.id}`}
      className={clsx(styles.entry_link, styles.file_link, isActive && styles.highlight_active)}
    >
      <IconNote size={18} />
      <span className={styles.label}>
        {isActive && activeTermTitle ? activeTermTitle : targetTerm.name}
      </span>
    </Tag>
  )
}
