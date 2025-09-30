import { Button } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import SideRight from "~/layouts/note/SideRight"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params
  const term = await getTermById(termId)
  if (!term) throw new Response("No term found", { status: 404 })

  return { term }
}

export default function Term({ loaderData }: Route.ComponentProps) {
  const { term } = loaderData

  return (
    <>
      <div className="editor-area">
        <EditorWith initialContent={term.editorContent}>
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
        <SideRight />
      </div>
    </>
  )
}
