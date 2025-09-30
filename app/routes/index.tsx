import { getRecentTerm } from "~/service/term"
import { redirect } from "react-router"

export async function loader() {
  const term = await getRecentTerm()
  if (!term) throw new Response("No recent term found", { status: 404 })

  const termId = term.id.toString()
  return redirect(`/terms/${termId}`)
}
