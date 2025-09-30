import { Accordion, Button, TagsInput } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import { findRelatedTerms } from "~/service/related-term"
import NetworkGraph from "~/components/network-graph/NetworkGraph"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params
  const [term, graphData] = await Promise.all([
    getTermById(termId),
    findRelatedTerms(Number(termId))
  ])
  if (!term) throw new Response("No term found", { status: 404 })

  return { term, graphData }
}

export default function Term({ loaderData, params }: Route.ComponentProps) {
  const { term, graphData } = loaderData
  const { termId } = params

  return (
    <>
      <div className="editor-area">
        <EditorWith initialContent={term.content}>
          <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
            Cancel
          </Button>
          <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
            Delete
          </Button>
          <SaveButton />
        </EditorWith>
      </div>
      <div className="rightside-area">
        <Accordion variant="contained" multiple defaultValue={["alias"]}>
          <Accordion.Item value="alias">
            <Accordion.Control>エイリアスの設定</Accordion.Control>
            <Accordion.Panel>
              <TagsInput
                label="Press Enter to submit a alias"
                placeholder="Type and press enter..."
              />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="related">
            <Accordion.Control>関連用語の設定</Accordion.Control>
            <Accordion.Panel>Related Input</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <NetworkGraph {...graphData} centerId={Number(termId)} />
        <div>TODO: MiniView</div>
      </div>
    </>
  )
}
