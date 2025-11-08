import { useAtom } from "jotai"
import { folderId$ } from "./ui.atoms"
import { useQuery } from "@tanstack/react-query"
import type { loader } from "~/routes/api/folders/children"
import { useSyncAtom } from "~/libs/jotai-utils/hooks"

export const useFolderExplorerUi = (initials: Awaited<ReturnType<typeof loader>>) => {
  useSyncAtom(folderId$, initials.current?.id ?? null)

  const [folderId, setFolderId] = useAtom(folderId$)

  const { data, isPending, isError } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: ["folders", "detail", folderId, "children"],
    queryFn: () => fetch(`/api/folders/${folderId}/children`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: folderId !== null,
    placeholderData: initials
  })

  return { data, isPending, isError, setFolderId }
}
