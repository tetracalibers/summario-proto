import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { resetEntryInput$ } from "./ui.actions"
import { displayedInputEntryType$, entryInputError$, entryInputValue$ } from "./ui.atoms"
import { folderIdforDB$, isActiveFileInput$, isActiveFolderInput$ } from "./ui.selectors"
import { useMutation, useQueryClient, type MutateOptions } from "@tanstack/react-query"
import { ActionError } from "~/libs/error"
import type { CreationSuccess } from "./types"
import type { EntryType } from "../types"

export const useFolderExplorerInputUi = () => {
  const showEntryInput = useSetAtom(displayedInputEntryType$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const isActiveFileInput = useAtomValue(isActiveFileInput$)
  const isActiveFolderInput = useAtomValue(isActiveFolderInput$)

  return { showEntryInput, resetAndHideEntryInput, isActiveFileInput, isActiveFolderInput }
}

export const useEmptyTermCreateUi = () => {
  const queryClient = useQueryClient()

  const parentId = useAtomValue(folderIdforDB$)
  const [name, setName] = useAtom(entryInputValue$)
  const [error, setError] = useAtom(entryInputError$)
  const resetAndHideEntryInput = useSetAtom(resetEntryInput$)

  const { mutate, isPending } = useMutation<CreationSuccess, ActionError, EntryType>({
    mutationKey: ["folders", "new"],
    mutationFn: (type: EntryType) =>
      fetch("/api/folders/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, parentId })
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new ActionError("Failed to create a new term.", data)
        return data
      }),
    onSuccess: () => {
      resetAndHideEntryInput()
      queryClient.invalidateQueries({ queryKey: ["folders", "detail", parentId, "children"] })
    },
    onError: () => {
      setError("保存に失敗しました")
    }
  })

  const save = (
    type: EntryType,
    options?: MutateOptions<CreationSuccess, ActionError, EntryType>
  ) => {
    if (name.trim().length === 0) {
      setError("名称を入力してください")
      return
    }
    mutate(type, options)
  }

  return { save, isSaving: isPending, setName, error }
}
