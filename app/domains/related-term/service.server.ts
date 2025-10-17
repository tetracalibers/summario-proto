import * as RelatedTermRepository from "~/domains/related-term/repository.server"

export const getRelatedTerms = async (termId: string) => {
  return RelatedTermRepository.findAllRelatedTerms(termId)
}
