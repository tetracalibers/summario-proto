import ItemContent from "./ItemContent"
import { IconFolder } from "@tabler/icons-react"
import { UnstyledButton } from "@mantine/core"

interface Props {
  folderName: string
  onClick: () => void
}

export default function FolderLink({ folderName, onClick }: Props) {
  return (
    <UnstyledButton onClick={onClick}>
      <ItemContent
        label={folderName}
        Icon={() => <IconFolder size={18} color="var(--mantine-color-bright-orange-6)" />}
      />
    </UnstyledButton>
  )
}
