import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { destFolder$, filesToMove$, foldersToMove$ } from "./ui.atoms"
import { resetMovingModeState$, updateFileIdsToMove$, updateFolderIdsToMove$ } from "./ui.actions"
import { isMovingMode$, selectedCount$ } from "./ui.selectors"
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import type { MoveSuccess } from "./types"
import { folderKeys, termKeys } from "~/query-keys"
import { folderId$ } from "../ui.atoms"
import { BatchActionError } from "~/libs/error"

interface MoveSuccessResponse extends MoveSuccess {
  message: string
}

export const useMoveToFolderUi = (currentTermId: number) => {
  const queryClient = useQueryClient()

  const show = useSetAtom(folderId$)

  const targetFiles = useAtomValue(filesToMove$)
  const targetFolders = useAtomValue(foldersToMove$)

  const [destFolder, setDestFolder] = useAtom(destFolder$)

  const resetMovingModeState = useSetAtom(resetMovingModeState$)

  const { mutate, isPending } = useMutation<MoveSuccessResponse, BatchActionError>({
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
    onSuccess: () => {
      resetMovingModeState()
      show(destFolder?.id ?? "root")
      queryClient.invalidateQueries({ queryKey: folderKeys.details() })
      queryClient.invalidateQueries({ queryKey: termKeys.path(currentTermId) })
    }
  })

  const execMoveApi = (options: UseMutationOptions<MoveSuccessResponse, BatchActionError>) => {
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
