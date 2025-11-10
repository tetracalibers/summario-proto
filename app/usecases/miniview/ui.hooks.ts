import { useAtom, useAtomValue } from "jotai"
import { miniviewTermId$, pageTermId$ } from "./ui.atoms"
import { isVisibleMiniview$ } from "./ui.selectors"
import { useSyncAtom } from "~/libs/jotai-utils/hooks"
import { useQuery } from "@tanstack/react-query"
import type { loader } from "~/routes/api/terms/preview"
import { termKeys } from "~/query-keys"

export const useMiniviewUi = (pageTermId: number) => {
  useSyncAtom(pageTermId$, pageTermId)

  const [miniviewTermId, setMiniviewTermId] = useAtom(miniviewTermId$)
  const isVisibleMiniview = useAtomValue(isVisibleMiniview$)

  const { data, isPending, isError } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: termKeys.preview(miniviewTermId!),
    queryFn: () => fetch(`/api/terms/${miniviewTermId}/preview`).then((res) => res.text()),
    enabled: isVisibleMiniview && miniviewTermId !== null
  })

  return { setMiniviewTermId, isVisibleMiniview, data, isPending, isError }
}
