import { Button } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import type { Route } from "./+types"
import { getRecentTerm } from "~/query/term"
import EditorWith from "~/components/editor/EditorWith"

export async function loader() {
  const [term] = await getRecentTerm(1)
  const editorContent = term.title + "\n" + term.content
  return { term: { ...term, content: editorContent } }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { term } = loaderData

  return (
    <EditorWith initialContent={term.content}>
      <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
        Cancel
      </Button>
      <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
        Delete
      </Button>
      <SaveButton />
    </EditorWith>
  )
}
