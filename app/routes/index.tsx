import { Button } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import type { Route } from "./+types"
import { getRecentTerm } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"

export async function loader() {
  const term = await getRecentTerm()
  if (!term) throw new Response("No recent term found", { status: 404 })

  return { term }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { term } = loaderData

  return (
    <EditorWith initialContent={term.editorContent}>
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
