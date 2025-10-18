import { useAtom, useAtomValue } from "jotai"
import { miniviewTermId$, pageTermId$ } from "./ui.atoms"
import { isVisibleMiniview$ } from "./ui.selectors"
import { useHydrateAtoms } from "jotai/utils"

export const useMiniviewUi = (pageTermId: number) => {
  useHydrateAtoms([[pageTermId$, pageTermId]])

  const [miniviewTermId, setMiniviewTermId] = useAtom(miniviewTermId$)
  const isVisibleMiniview = useAtomValue(isVisibleMiniview$)

  return { miniviewTermId, setMiniviewTermId, isVisibleMiniview }
}
