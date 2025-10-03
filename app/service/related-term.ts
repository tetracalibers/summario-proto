import { selectAllRelatedTerms, selectTermsWithoutId } from "~/db/query"
import { sortTermsByNearestFolder } from "./folder"
import type { Term } from "~/db/schema"

export const getRelatedTerms = async (centerId: number) => {
  return selectAllRelatedTerms(centerId)
}

export const getRelatedTermsSuggestions = async (currentTerm: Term) => {
  const terms = await selectTermsWithoutId(currentTerm.id)
  return sortTermsByNearestFolder(terms, currentTerm.folderId)
}
