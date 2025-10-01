import { selectAllAliasByTermId } from "~/db/query"

export const getTermAlias = async (termId: number) => {
  return selectAllAliasByTermId(termId)
}
