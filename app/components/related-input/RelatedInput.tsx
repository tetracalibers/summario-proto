import { TagsInput } from "@mantine/core"
import { useRelatedTermUi } from "~/domains/related-term/ui.actions"
import type { RelatedTerm } from "~/domains/related-term/types"
import { useTermContentsSavingState } from "~/features/edit-term/ui.selectors"

interface Props {
  initials: RelatedTerm[]
  suggestions: RelatedTerm[]
}

export default function RelatedInput({ initials, suggestions }: Props) {
  const { isSaving } = useTermContentsSavingState()
  const { setUiValues } = useRelatedTermUi(initials, suggestions)

  return (
    <TagsInput
      label="Related Terms"
      placeholder="Enter"
      defaultValue={initials.map((term) => term.title)}
      data={suggestions.map((term) => term.title)}
      onChange={(values) => setUiValues(values)}
      comboboxProps={{ shadow: "sm" }}
      disabled={isSaving}
    />
  )
}
