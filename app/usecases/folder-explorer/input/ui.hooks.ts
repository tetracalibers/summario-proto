import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { resetEntryInput$ } from "./ui.actions"
import { displayedInputEntryType$, entryInputValue$ } from "./ui.atoms"
import { isActiveFileInput$, isActiveFolderInput$ } from "./ui.selectors"
import { useMutation, useQueryClient, type MutateOptions } from "@tanstack/react-query"
import { folderId$ } from "../ui.atoms"
import { ActionError } from "~/libs/error"
import type { CreationSuccess } from "./types"

export const useFolderExplorerInputUi = () => {
  const showEntryInput = useSetAtom(displayedInputEntryType$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const isActiveFileInput = useAtomValue(isActiveFileInput$)
  const isActiveFolderInput = useAtomValue(isActiveFolderInput$)

  return { showEntryInput, resetAndHideEntryInput, isActiveFileInput, isActiveFolderInput }
}

export const useEmptyTermCreateUi = () => {
  const queryClient = useQueryClient()

  const folderId = useAtomValue(folderId$)
  const [title, setTitle] = useAtom(entryInputValue$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const { mutate, isPending } = useMutation<CreationSuccess, ActionError, Object>({
    mutationKey: ["terms", "new"],
    mutationFn: () =>
      fetch("/api/terms/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, folderId: folderId === "root" ? null : folderId })
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new ActionError("Failed to create a new term.", data)
        return data
      }),
    onSuccess: () => {
      resetAndHideEntryInput()
      queryClient.invalidateQueries({ queryKey: ["folders", "detail", folderId, "children"] })
    }
  })

  const save = (options: MutateOptions<CreationSuccess, ActionError, Object>) => mutate({}, options)

  return { save, isSaving: isPending, setTitle }
}
