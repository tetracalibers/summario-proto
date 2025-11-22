import { ActionIcon } from "@mantine/core"
import { IconLock, IconLockOpen } from "@tabler/icons-react"

interface Props {
  locked: boolean
  toggleLocked: () => void
}

export default function ToggleLockButton({ locked, toggleLocked }: Props) {
  return (
    <ActionIcon variant="transparent" radius="xl" aria-label="toggle lock" onClick={toggleLocked}>
      {locked ? (
        <IconLock size={16} color="var(--mantine-color-gray-7)" />
      ) : (
        <IconLockOpen size={16} color="var(--mantine-color-gray-7)" />
      )}
    </ActionIcon>
  )
}
