import { useAtom, useSetAtom } from "jotai"
import { destinationFolderId$ } from "./ui.atoms"
import { updateFileIdsToMove$, updateFolderIdsToMove$ } from "./ui.actions"

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
