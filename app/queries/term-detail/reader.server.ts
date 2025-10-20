import * as TermService from "~/aggregates/term/service.server"
import * as AliasService from "~/aggregates/alias/service.server"
import * as RelatedTermService from "~/aggregates/related-term/service.server"

export const getTerm = async (id: number) => {
  return TermService.getTerm(id)
}

export const getRecentTerm = async () => {
  return TermService.getRecentTerm()
}

export const getTermWithMeta = async (id: number) => {
  const [term, alias, related] = await Promise.all([
    TermService.getTerm(id),
    AliasService.getAliases(id),
    RelatedTermService.getRelatedTerms(id)
  ])

  return { term, alias, related }
}
