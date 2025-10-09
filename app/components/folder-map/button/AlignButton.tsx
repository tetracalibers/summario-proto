import { ActionIcon } from "@mantine/core"
import { IconAlignLeft2 } from "@tabler/icons-react"

interface Props {
  onClick: () => void
}

export default function AlignButton({ onClick }: Props) {
  return (
    <ActionIcon
      onClick={onClick}
      size="lg"
      aria-label="layout"
      variant="outline"
      color="grape"
      bg="white"
    >
      <IconAlignLeft2 />
    </ActionIcon>
  )
}
