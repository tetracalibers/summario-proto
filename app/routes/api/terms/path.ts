import { getTermPath } from "~/queries/term-path/reader.server"
import type { Route } from "./+types/path"

export async function loader({ params }: Route.ActionArgs) {
  const paths = await getTermPath(Number(params.termId))

  return paths
}
