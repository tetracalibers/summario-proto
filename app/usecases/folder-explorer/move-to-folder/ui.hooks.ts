import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { destinationFolderId$, fileIdsToMove$, folderIdsToMove$ } from "./ui.atoms"
import { updateFileIdsToMove$, updateFolderIdsToMove$ } from "./ui.actions"
import { useResetAtom } from "jotai/utils"
import { isMovingMode$ } from "./ui.selectors"

export const useSwitchMovingModeUi = () => {
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

  const resetDestinationFolderId = useResetAtom(destinationFolderId$)
  const resetFileIdsToMove = useResetAtom(fileIdsToMove$)
  const resetFolderIdsToMove = useResetAtom(folderIdsToMove$)

  const cancelMovingMode = () => {
    resetDestinationFolderId()
    resetFileIdsToMove()
    resetFolderIdsToMove()
  }

  return { cancelMovingMode, isMovingMode }
}
