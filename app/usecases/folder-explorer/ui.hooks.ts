import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { folderId$, selectedEntries$ } from "./ui.atoms"
import { useQuery } from "@tanstack/react-query"
import type { loader } from "~/routes/api/folders/children"
import { useSyncAtom } from "~/libs/jotai-utils/hooks"
import { folderKeys } from "~/query-keys"
import { selectEntry$, deselectEntry$ } from "./ui.actions"
import type { Entry } from "./types"
import { isSelectionMode$ } from "./ui.selectors"
import { destinationFolderId$ } from "./move-to-folder/ui.atoms"

export const useFolderExplorerUi = (initials: Awaited<ReturnType<typeof loader>>) => {
  useSyncAtom(folderId$, initials.current?.id ?? null)

  const [folderId, setFolderId] = useAtom(folderId$)

  const isSelectionMode = useAtomValue(isSelectionMode$)
  const destinationFolderId = useAtomValue(destinationFolderId$)
  const selectedEntries = useAtomValue(selectedEntries$)

  const selectEntry = useSetAtom(selectEntry$)
  const deselectEntry = useSetAtom(deselectEntry$)
  const updateSelection = (entry: Entry, checked: boolean) => {
    if (checked) {
      selectEntry(entry)
    } else {
      deselectEntry(entry)
    }
  }

  const { data, isPending, isError } = useQuery<Awaited<ReturnType<typeof loader>>>({
    queryKey: folderKeys.children(`${folderId}`),
    queryFn: () => fetch(`/api/folders/${folderId}/children`).then((res) => res.json()),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: folderId !== null,
    placeholderData: initials
  })

  return {
    data,
    isPending,
    isError,
    setFolderId,
    isSelectionMode,
    destinationFolderId,
    selectedEntries,
    updateSelection
  }
}
