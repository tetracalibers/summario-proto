import { TagsInput } from "@mantine/core"
import { useAliasUi } from "~/aggregates/alias/ui.hooks"
import type { Alias } from "~/aggregates/alias/types"
import { useTermContentsSavingState } from "~/usecases/term-edit/ui.hooks"
import { useParams } from "react-router"

interface Props {
  initials: Alias[]
}

export default function AliasInput({ initials }: Props) {
  const { termId } = useParams()
  const { isSaving } = useTermContentsSavingState(Number(termId))
  const { setUiValues } = useAliasUi(initials)

  return (
    <TagsInput
      label="Alias"
      placeholder="Enter"
      defaultValue={initials.map((a) => a.title)}
      onChange={(values) => setUiValues(values)}
      disabled={isSaving}
    />
  )
}
