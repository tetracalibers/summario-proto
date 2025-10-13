import { NavLink } from "react-router"
import ItemContent from "./ItemContent"
import { IconNote } from "@tabler/icons-react"

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
      to={`/terms/${targetTerm.id}${targetTerm.parentId ? `?dir=${targetTerm.parentId}` : ""}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <ItemContent
        label={targetTerm.name}
        Icon={() => <IconNote size={18} color="var(--mantine-color-cyan-4)" />}
      />
    </NavLink>
  )
}
