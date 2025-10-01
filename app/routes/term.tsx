import { Button, Paper, Stack, TagsInput } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import { findRelatedTerms, getRelatedTermsSuggestions } from "~/service/related-term"
import { getTermAlias } from "~/service/alias"
import AliasInput from "~/components/alias-input/AliasInput"
import { useAtomValue } from "jotai"
import { dirtyAliasAtom } from "~/components/alias-input/atoms"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"

export async function loader({ params }: Route.LoaderArgs) {
  const termId = Number(params.termId)

  const [term, { nodes: relatedTerms, edges }, alias] = await Promise.all([
    getTermById(termId),
    findRelatedTerms(termId),
    getTermAlias(termId)
  ])
  const relatedSuggestions = await getRelatedTermsSuggestions(term)

  return { term, relatedTerms, edges, alias, relatedSuggestions }
}

export default function Term({ loaderData, params }: Route.ComponentProps) {
  const { term, relatedTerms, edges, alias, relatedSuggestions } = loaderData
  const { termId } = params

  const isDirtyAlias = useAtomValue(dirtyAliasAtom)

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
          <SaveButton isDirtyList={[isDirtyAlias]} />
        </div>
      </EditorWith>
      <div className="rightside-area">
        <Paper shadow="0" withBorder p="1rem" pt="0.6rem">
          <Stack gap="sm">
            <AliasInput alias={alias} />
            <TagsInput
              label="Related Terms"
              placeholder="Enter"
              defaultValue={relatedTerms.map((term) => term.title)}
              data={relatedSuggestions.map((term) => term.title)}
            />
          </Stack>
        </Paper>
        <RelatedTermView nodes={relatedTerms} edges={edges} termId={termId} />
      </div>
    </>
  )
}
