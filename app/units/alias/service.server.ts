import * as AliasRepository from "~/units/alias/repository.server"

export const getAliases = async (termId: number) => {
  return AliasRepository.findAllByTermId(termId)
}

export const addAliases = async (termId: number, aliasLabels: string[]) => {
  return AliasRepository.insertAliases(termId, aliasLabels)
}

export const removeAliases = async (aliasIds: number[]) => {
  return AliasRepository.deleteAliases(aliasIds)
}
