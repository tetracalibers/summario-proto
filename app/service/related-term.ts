import { selectTermsWithoutId } from "~/db/query"
import { sortTermsByNearestFolder } from "./folder"

export const getRelatedTermsSuggestions = async (currentTerm: {
  id: number
  folderId: number | null
}) => {
  const terms = await selectTermsWithoutId(currentTerm.id)
  return sortTermsByNearestFolder(terms, currentTerm.folderId)
}
