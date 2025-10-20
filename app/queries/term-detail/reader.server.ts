import * as TermService from "~/units/term/service.server"
import * as AliasService from "~/units/alias/service.server"
import * as RelatedTermService from "~/units/related-term/service.server"

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
