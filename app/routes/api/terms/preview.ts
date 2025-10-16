import { getTermById } from "~/service/term"
import type { Route } from "./+types/preview"

export async function loader({ params }: Route.ActionArgs) {
  const term = await getTermById(Number(params.termId))
  return term.content
}
