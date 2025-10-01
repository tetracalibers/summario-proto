import { Accordion, Button } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import { findRelatedTerms } from "~/service/related-term"
import { getTermAlias } from "~/service/alias"
import AliasInput from "~/components/alias-input/AliasInput"
import { useAtomValue } from "jotai"
import { dirtyAliasAtom } from "~/components/alias-input/atoms"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"

export async function loader({ params }: Route.LoaderArgs) {
  const termId = Number(params.termId)

  const [term, graphData, alias] = await Promise.all([
    getTermById(termId),
    findRelatedTerms(termId),
    getTermAlias(termId)
  ])

  return { term, graphData, alias }
}

export default function Term({ loaderData, params }: Route.ComponentProps) {
  const { term, graphData, alias } = loaderData
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
        <Accordion variant="contained" multiple defaultValue={["alias"]}>
          <Accordion.Item value="alias">
            <Accordion.Control>エイリアスの設定</Accordion.Control>
            <Accordion.Panel>
              <AliasInput alias={alias} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="related">
            <Accordion.Control>関連用語の設定</Accordion.Control>
            <Accordion.Panel>Related Input</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <RelatedTermView {...graphData} termId={termId} />
      </div>
    </>
  )
}
