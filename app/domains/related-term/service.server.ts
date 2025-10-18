import * as RelatedTermRepository from "~/domains/related-term/repository.server"

export const getRelatedTerms = async (termId: string) => {
  return RelatedTermRepository.findAllRelatedTerms(termId)
}

export const addRelatedTerms = async (termId: number, relatedTermIds: number[]) => {
  return RelatedTermRepository.createTermRelations(termId, relatedTermIds)
}

export const removeRelatedTerms = async (termId: number, relatedTermIds: number[]) => {
  return RelatedTermRepository.deleteTermRelations(termId, relatedTermIds)
}
