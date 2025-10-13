import { NavLink } from "react-router"
import ItemContent from "./ItemContent"
import { IconNote } from "@tabler/icons-react"
import styles from "./FileLink.module.css"

interface Props {
  targetTerm: {
    id: string | number
    name: string
    parentId: string | number | null
  }
}

export default function FileLink({ targetTerm }: Props) {
  return (
    <NavLink to={`/terms/${targetTerm.id}`} className={styles.link} reloadDocument>
      <ItemContent
        label={targetTerm.name}
        Icon={() => <IconNote size={18} color="var(--mantine-color-cyan-4)" />}
      />
    </NavLink>
  )
}
