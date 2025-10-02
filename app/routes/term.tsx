import { Button, Stack } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import { getRelatedTerms, getRelatedTermsSuggestions } from "~/service/related-term"
import { getTermAlias } from "~/service/alias"
import AliasInput from "~/components/alias-input/AliasInput"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"
import RelatedInput from "~/components/related-input/RelatedInput"

export async function loader({ params }: Route.LoaderArgs) {
  const termId = Number(params.termId)

  const [term, alias, nodes] = await Promise.all([
    getTermById(termId),
    getTermAlias(termId),
    getRelatedTerms(termId)
  ])
  const relatedSuggestions = await getRelatedTermsSuggestions(term)

  return { term, nodes, alias, relatedSuggestions }
}

export default function Term({ loaderData }: Route.ComponentProps) {
  const { term, nodes, alias, relatedSuggestions } = loaderData

  return (
    <>
      <EditorWith initialContent={term.content}>
        <div className="controls-area">
          <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
            Cancel
          </Button>
          <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
            Delete
          </Button>
        </div>
        <div className="save-area">
          <SaveButton />
        </div>
      </EditorWith>
      <div className="rightside-area">
        <Stack gap="xs">
          <AliasInput initials={alias} />
          <RelatedInput
            initials={nodes.filter((n) => n.id !== term.id)}
            suggestions={relatedSuggestions}
          />
        </Stack>
        <RelatedTermView centerNode={term} />
      </div>
    </>
  )
}
