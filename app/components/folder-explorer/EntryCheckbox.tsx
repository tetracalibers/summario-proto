import { Checkbox } from "@mantine/core"

interface Props {
  type: "file" | "folder"
  onChange: (checked: boolean) => void
}

export default function EntryCheckbox({ type, onChange }: Props) {
  return (
    <Checkbox
      aria-label={`select ${type}`}
      color="pink"
      size="xs"
      variant="outline"
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
  )
}
