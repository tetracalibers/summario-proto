import { TagsInput } from "@mantine/core"
import { useRelatedTermUi } from "~/aggregates/related-term/ui.hooks"
import type { RelatedTerm } from "~/aggregates/related-term/types"
import { useTermContentsSavingState } from "~/usecases/term-edit/ui.hooks"
import { useParams } from "react-router"

interface Props {
  initials: RelatedTerm[]
  options: RelatedTerm[]
}

export default function RelatedInput({ initials, options }: Props) {
  const { termId } = useParams()
  const { isSaving } = useTermContentsSavingState(Number(termId))
  const { setUiValues } = useRelatedTermUi(initials, options)

  return (
    <TagsInput
      label="Related Terms"
      placeholder="Enter"
      defaultValue={initials.map((term) => term.title)}
      data={options.map((term) => term.title)}
      onChange={(values) => setUiValues(values)}
      comboboxProps={{ shadow: "sm" }}
      disabled={isSaving}
    />
  )
}
