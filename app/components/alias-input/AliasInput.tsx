import { TagsInput } from "@mantine/core"
import { useAliasUi } from "~/domains/alias/ui.actions"
import type { Alias } from "~/domains/alias/types"
import { useTermContentsSavingState } from "~/features/edit-term/ui.selectors"

interface Props {
  initials: Alias[]
}

export default function AliasInput({ initials }: Props) {
  const { isSaving } = useTermContentsSavingState()
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
