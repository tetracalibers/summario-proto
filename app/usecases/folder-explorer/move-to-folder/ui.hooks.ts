import { useSetAtom } from "jotai"
import { destinationFolderId$ } from "./ui.atoms"

export const useSwitchMovingModeUi = () => {
  const setDestinationFolderId = useSetAtom(destinationFolderId$)

  return {
    setDestinationFolderId
  }
}
