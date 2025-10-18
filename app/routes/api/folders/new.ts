import type { Route } from "./+types/new"

export async function action({ request, params }: Route.ActionArgs) {
  return { unimplemented: true }
}
