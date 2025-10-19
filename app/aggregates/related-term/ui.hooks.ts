import { useSetAtom } from "jotai"
import { optionsRelatedTerm$, serverRelatedTerm$, uiRelatedTermLabel$ } from "./ui.atoms"
import type { RelatedTerm } from "./types"
import { useSyncAtom } from "~/libs/jotai-utils/use-atom"

export function useRelatedTermUi(initials: RelatedTerm[], options: RelatedTerm[]) {
  useSyncAtom(serverRelatedTerm$, new Map(initials.map((item) => [item.title, item.id])))
  useSyncAtom(optionsRelatedTerm$, new Map(options.map((item) => [item.title, item.id])))
  useSyncAtom(
    uiRelatedTermLabel$,
    initials.map((item) => item.title)
  )

  const setUiValues = useSetAtom(uiRelatedTermLabel$)

  return { setUiValues }
}
