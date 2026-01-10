import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { destinationFolderId$, fileIdsToMove$, folderIdsToMove$ } from "./ui.atoms"
import { resetMovingModeState$, updateFileIdsToMove$, updateFolderIdsToMove$ } from "./ui.actions"
import { isMovingMode$, selectedCount$ } from "./ui.selectors"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMoveToFolderUi = () => {
  const queryClient = useQueryClient()

  const targetFileIds = useAtomValue(fileIdsToMove$)
  const targetFolderIds = useAtomValue(folderIdsToMove$)

  const newParentId = useAtomValue(destinationFolderId$)

  const resetMovingModeState = useSetAtom(resetMovingModeState$)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      fetch("/api/entries/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileIds: Array.from(targetFileIds),
          folderIds: Array.from(targetFolderIds),
          newParentId
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

  return { execMoveApi: mutate, isMoving: isPending }
}

export const useMovingTargetFolderUi = () => {
  const [destinationFolderId, setDestinationFolderId] = useAtom(destinationFolderId$)

  return {
    destinationFolderId,
    setDestinationFolderId
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
