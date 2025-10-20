import * as TermListReadStore from "./readstore.server"

export const getRelatedTermOptions = async (
  currentTermId: number,
  currentFolderId: number | null
) => {
  return TermListReadStore.findSortedByFolderProximityExcluding(currentTermId, currentFolderId)
}
