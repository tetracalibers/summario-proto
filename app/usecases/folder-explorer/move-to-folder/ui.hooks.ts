import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { destFolder$, filesToMove$, foldersToMove$ } from "./ui.atoms"
import {
  removeFileIdsToMove$,
  removeFolderIdsToMove$,
  resetMovingModeState$,
  updateFileIdsToMove$,
  updateFolderIdsToMove$
} from "./ui.actions"
import { isMovingMode$, selectedCount$ } from "./ui.selectors"
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import { folderKeys, termKeys } from "~/query-keys"
import { folderId$ } from "../ui.atoms"
import { BatchActionError } from "~/libs/error"
import type { action } from "~/routes/api/entries/move"

export const useMoveToFolderUi = (currentTermId: number) => {
  const queryClient = useQueryClient()

  const show = useSetAtom(folderId$)

  const targetFiles = useAtomValue(filesToMove$)
  const targetFolders = useAtomValue(foldersToMove$)

  const [destFolder, setDestFolder] = useAtom(destFolder$)

  const removeTargetFiles = useSetAtom(removeFileIdsToMove$)
  const removeTargetFolders = useSetAtom(removeFolderIdsToMove$)

  const resetMovingModeState = useSetAtom(resetMovingModeState$)

  const { mutate, isPending } = useMutation<Awaited<ReturnType<typeof action>>, BatchActionError>({
    mutationFn: () =>
      fetch("/api/entries/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targets: {
            file: { ids: [...targetFiles.keys()], names: [...targetFiles.values()] },
            folder: { ids: [...targetFolders.keys()], names: [...targetFolders.values()] }
          },
          newParent: destFolder
        })
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new BatchActionError("Failed to move entries.", data)
        return data
      }),
    onSuccess: ({ errorsCount, success }) => {
      if (errorsCount === 0) {
        resetMovingModeState()
        show(destFolder?.id ?? "root")
      } else {
        removeTargetFiles(success.file)
        removeTargetFolders(success.folder)
      }

      queryClient.invalidateQueries({ queryKey: folderKeys.details() })
      queryClient.invalidateQueries({ queryKey: termKeys.path(currentTermId) })
    }
  })

  const execMoveApi = (
    options: UseMutationOptions<Awaited<ReturnType<typeof action>>, BatchActionError>
  ) => {
    if (destFolder === null) return
    mutate(void 0, options)
  }

  return {
    destFolder,
    setDestFolder,
    execMoveApi,
    isMoving: isPending
  }
}

export const useCheckFolderToMoveUi = () => {
  const updateCheckedFolder = useSetAtom(updateFolderIdsToMove$)

  return { updateCheckedFolder }
}

export const useCheckFileToMoveUi = () => {
  const updateCheckedFile = useSetAtom(updateFileIdsToMove$)

  return { updateCheckedFile }
}

export const useMovingModeUi = () => {
  const isMovingMode = useAtomValue(isMovingMode$)
  const selectedCount = useAtomValue(selectedCount$)

  const cancelMovingMode = useSetAtom(resetMovingModeState$)

  return { cancelMovingMode, isMovingMode, selectedCount }
}
