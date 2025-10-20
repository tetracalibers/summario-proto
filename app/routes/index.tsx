import { redirect } from "react-router"
import { getRecentTerm } from "~/queries/term-detail/reader.server"

export async function loader() {
  const term = await getRecentTerm()
  if (!term) throw new Response("No recent term found", { status: 404 })

  return redirect(`/terms/${term.id}`)
}
