import * as RelatedTermRepository from "~/aggregates/related-term/repository.server"

export const getRelatedTerms = async (termId: number) => {
  return RelatedTermRepository.findAllByTermId(termId)
}

export const addRelatedTerms = async (termId: number, relatedTermIds: number[]) => {
  return RelatedTermRepository.createTermRelations(termId, relatedTermIds)
}

export const removeRelatedTerms = async (termId: number, relatedTermIds: number[]) => {
  return RelatedTermRepository.deleteTermRelations(termId, relatedTermIds)
}
