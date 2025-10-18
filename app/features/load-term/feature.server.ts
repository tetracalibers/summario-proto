import * as TermService from "~/domains/term/service.server"
import * as AliasService from "~/domains/alias/service.server"
import * as RelatedTermService from "~/domains/related-term/service.server"

export const getTerm = async (id: string) => {
  return TermService.getTerm(id)
}

export const getRecentTerm = async () => {
  return TermService.getRecentTerm()
}

export const getTermWithMeta = async (id: string) => {
  const [term, alias, related] = await Promise.all([
    TermService.getTerm(id),
    AliasService.getAliases(id),
    RelatedTermService.getRelatedTerms(id)
  ])

  return { term, alias, related }
}
