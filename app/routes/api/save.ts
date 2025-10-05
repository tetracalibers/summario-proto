import { saveTermContentAndMeta } from "./../../service/term"
import type { Route } from "./+types/save"

export async function action({ request, params }: Route.ActionArgs) {
  const termId = Number(params.termId)
  const data = await request.json()
  return saveTermContentAndMeta(termId, data)
}
