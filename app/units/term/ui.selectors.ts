import { atom } from "jotai"
import { termTitle$ } from "./ui.atoms"

export const isEmptyTermTitle$ = atom((get) => {
  const title = get(termTitle$)
  if (title === null) return true
  return title.trim().length === 0
})
