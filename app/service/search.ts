import { selectAllTermsAndAlias } from "~/db/query"

const rawDataToUIData = (term: { id: number; title: string; alias: string | null }) => {
  return [term.title, ...(term.alias ? [term.alias] : [])]
}

export const getAllSearchKeywords = async () => {
  const searchTargets = await selectAllTermsAndAlias()
  return searchTargets.flatMap(rawDataToUIData)
}
