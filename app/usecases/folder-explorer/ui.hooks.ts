import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { resetEntryInput$ } from "./ui.actions"
import { displayedInputEntryType$, folderId$ } from "./ui.atoms"
import { isActiveFileInput$, isActiveFolderInput$ } from "./ui.selectors"
import { useQuery } from "@tanstack/react-query"
import type { loader } from "~/routes/api/folders/children"

export const useFolderExplorerInputUi = () => {
  const showEntryInput = useSetAtom(displayedInputEntryType$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const isActiveFileInput = useAtomValue(isActiveFileInput$)
  const isActiveFolderInput = useAtomValue(isActiveFolderInput$)

  return { showEntryInput, resetAndHideEntryInput, isActiveFileInput, isActiveFolderInput }
}

export const useFolderExplorerUi = (initials: Awaited<ReturnType<typeof loader>>) => {
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
