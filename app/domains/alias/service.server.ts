import * as AliasRepository from "~/domains/alias/repository.server"

export const getAliases = async (termId: string) => {
  return AliasRepository.findAllAliasesByTermId(termId)
}
