import { TagsInput } from "@mantine/core"
import { useAliasUi } from "~/units/alias/ui.hooks"
import type { Alias } from "~/units/alias/types"
import { useTermContentsSavingState } from "~/usecases/term-edit/ui.hooks"
import { useParams } from "react-router"
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"

interface Props {
  initials: Alias[]
}

export default function AliasList({ node }: ReactNodeViewProps & Props) {
  const initials: Alias[] = JSON.parse(node.attrs.initials)

  const { termId } = useParams()
  const { isSaving } = useTermContentsSavingState(Number(termId))
  const { setUiValues } = useAliasUi(initials)

  return (
    <NodeViewWrapper className="AliasList">
      <TagsInput
        label="Alias"
        placeholder="Enter after typing..."
        defaultValue={initials.map((a) => a.title)}
        onChange={(values) => setUiValues(values)}
        disabled={isSaving}
        size="xs"
        variant="unstyled"
      />
    </NodeViewWrapper>
  )
}
