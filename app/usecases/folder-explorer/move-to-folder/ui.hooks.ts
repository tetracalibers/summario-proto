import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { destFolder$, filesToMove$, foldersToMove$ } from "./ui.atoms"
import { resetMovingModeState$, updateFileIdsToMove$, updateFolderIdsToMove$ } from "./ui.actions"
import { isMovingMode$, selectedCount$ } from "./ui.selectors"
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import type { MoveSuccess } from "./types"

interface MoveSuccessResponse extends MoveSuccess {
  message: string
}
interface MoveFailureResponse {
  errors: { message: string }[]
}

export const useMoveToFolderUi = () => {
  const queryClient = useQueryClient()

  const targetFiles = useAtomValue(filesToMove$)
  const targetFolders = useAtomValue(foldersToMove$)
  console.log("targetFiles:", targetFiles)

  const [destFolder, setDestFolder] = useAtom(destFolder$)

  const resetMovingModeState = useSetAtom(resetMovingModeState$)

  const { mutate, isPending } = useMutation<MoveSuccessResponse, MoveFailureResponse>({
    mutationFn: () =>
      fetch("/api/entries/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targets: {
            files: targetFiles,
            folders: targetFolders
          },
          newParent: destFolder
        })
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to move entries.")
        return data
      }),
    onSuccess: () => {
      resetMovingModeState()
      queryClient.invalidateQueries({ queryKey: ["folders", "children"] })
      // TODO: エディタの上のパス文字列を更新
    }
  })

  return {
    destFolder,
    setDestFolder,
    execMoveApi: (options: UseMutationOptions<MoveSuccessResponse, MoveFailureResponse>) =>
      mutate(void 0, options),
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
