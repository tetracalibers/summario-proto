import { useAtom } from "jotai"
import { destinationFolderId$ } from "./ui.atoms"

export const useSwitchMovingModeUi = () => {
  const [destinationFolderId, setDestinationFolderId] = useAtom(destinationFolderId$)

  return {
    destinationFolderId,
    setDestinationFolderId
  }
}
