import { useAtom, useAtomValue } from "jotai"
import { miniviewTermId$, pageTermId$ } from "./ui.atoms"
import { isVisibleMiniview$ } from "./ui.selectors"
import { useSyncAtom } from "~/libs/jotai-utils/use-atom"

export const useMiniviewUi = (pageTermId: number) => {
  useSyncAtom(pageTermId$, pageTermId)

  const [miniviewTermId, setMiniviewTermId] = useAtom(miniviewTermId$)
  const isVisibleMiniview = useAtomValue(isVisibleMiniview$)

  return { miniviewTermId, setMiniviewTermId, isVisibleMiniview }
}
