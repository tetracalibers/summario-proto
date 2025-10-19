import { useSetAtom } from "jotai"
import { optionsRelatedTerm$, serverRelatedTerm$, uiRelatedTermLabel$ } from "./ui.atoms"
import { useHydrateAtoms } from "jotai/utils"
import type { RelatedTerm } from "./types"

export function useRelatedTermUi(initials: RelatedTerm[], options: RelatedTerm[]) {
  useHydrateAtoms([
    [serverRelatedTerm$, new Map(initials.map((item) => [item.title, item.id]))],
    [optionsRelatedTerm$, new Map(options.map((item) => [item.title, item.id]))],
    [uiRelatedTermLabel$, initials.map((item) => item.title)]
  ])

  const setUiValues = useSetAtom(uiRelatedTermLabel$)

  return { setUiValues }
}
