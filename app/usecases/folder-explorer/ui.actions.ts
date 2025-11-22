import { atom } from "jotai"
import { selectedEntries$ } from "./ui.atoms"
import type { Entry } from "./types"

export const selectEntry$ = atom(null, (get, set, newEntry: Entry) => {
  const selectedEntries = new Set(get(selectedEntries$))
  selectedEntries.add(newEntry)
  set(selectedEntries$, selectedEntries)
})

export const deselectEntry$ = atom(null, (get, set, targetEntry: Entry) => {
  const selectedEntries = new Set(get(selectedEntries$))
  selectedEntries.forEach((entry) => {
    if (entry.id === targetEntry.id && entry.type === targetEntry.type) {
      selectedEntries.delete(entry)
    }
  })
  set(selectedEntries$, selectedEntries)
})
