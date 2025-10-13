import { Group } from "@mantine/core"
import type { JSX } from "react"

interface Props {
  label: string
  Icon: () => JSX.Element
}

export default function ItemContent({ label, Icon }: Props) {
  return (
    <Group gap={5} wrap="nowrap">
      <Icon />
      <span
        style={{
          fontSize: "0.9rem",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        {label}
      </span>
    </Group>
  )
}
