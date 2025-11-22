import { NavLink } from "react-router"
import { IconNote } from "@tabler/icons-react"
import styles from "./EntryLink.module.css"
import { clsx } from "clsx"
import { useTermTitleState } from "~/units/term/ui.hooks"
import EntryCheckbox from "./EntryCheckbox"
import type { Entry } from "~/usecases/folder-explorer/types"

interface Props {
  targetTerm: {
    id: number
    name: string
  }
  isActive: boolean
  selectable: boolean
  updateSelection: (entry: Entry, selected: boolean) => void
}

export default function FileLink({ targetTerm, isActive, selectable, updateSelection }: Props) {
  const { termTitle: activeTermTitle } = useTermTitleState()

  const Tag = isActive || selectable ? "div" : NavLink

  return (
    <Tag
      to={`/terms/${targetTerm.id}`}
      className={clsx(styles.entry_link, styles.file_link, isActive && styles.highlight_active)}
    >
      <IconNote size={18} />
      <span className={styles.label}>
        {isActive && activeTermTitle ? activeTermTitle : targetTerm.name}
      </span>
      {selectable && (
        <EntryCheckbox
          type="file"
          onChange={(checked) => updateSelection({ type: "file", id: targetTerm.id }, checked)}
        />
      )}
    </Tag>
  )
}
