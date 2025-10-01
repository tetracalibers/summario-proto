import { TagsInput } from "@mantine/core"

interface Props {
  initials: { id: number; title: string }[]
  suggestions: { id: number; title: string }[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  return (
    <TagsInput
      label="Related Terms"
      placeholder="Enter"
      defaultValue={initials.map((term) => term.title)}
      data={suggestions.map((term) => term.title)}
      comboboxProps={{ shadow: "sm" }}
    />
  )
}
