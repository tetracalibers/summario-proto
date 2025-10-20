import type { Route } from "./+types/rename"

export async function action({ request, params }: Route.ActionArgs) {
  return { unimplemented: true }
}
