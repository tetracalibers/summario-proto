import * as AliasRepository from "~/aggregates/alias/repository.server"

export const getAliases = async (termId: string) => {
  return AliasRepository.findAllAliasesByTermId(termId)
}

export const addAliases = async (termId: number, aliasLabels: string[]) => {
  return AliasRepository.insertAliases(termId, aliasLabels)
}

export const removeAliases = async (aliasIds: number[]) => {
  return AliasRepository.deleteAliases(aliasIds)
}
