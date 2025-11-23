import { NavLink } from "react-router"
import { IconNote } from "@tabler/icons-react"
import styles from "./EntryLink.module.css"
import { clsx } from "clsx"
import { useTermTitleState } from "~/units/term/ui.hooks"
import EntryCheckbox from "./EntryCheckbox"
import { useCheckFileToMoveUi } from "~/usecases/folder-explorer/move-to-folder/ui.hooks"

interface Props {
  targetTerm: {
    id: number
    name: string
  }
  isActive: boolean
  selectable: boolean
}

export default function FileLink({ targetTerm, isActive, selectable }: Props) {
  const { termTitle: activeTermTitle } = useTermTitleState()
  const { updateCheckedFile } = useCheckFileToMoveUi()

  const Tag = isActive || selectable ? "div" : NavLink

  return (
    <Tag
      to={`/terms/${targetTerm.id}`}
      className={clsx(
        styles.entry_link,
        styles.file_link,
        isActive && !selectable && styles.highlight_active,
        selectable && styles.selectable
      )}
    >
      <IconNote size={18} className={styles.entry_icon} />
      <span className={styles.label}>
        {isActive && activeTermTitle ? activeTermTitle : targetTerm.name}
      </span>
      {selectable && (
        <EntryCheckbox type="file" onChange={() => updateCheckedFile(targetTerm.id)} />
      )}
    </Tag>
  )
}
