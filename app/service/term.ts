import { selectRecentTerm, selectTermById } from "~/db/query"

export const getTermById = async (id: string) => {
  const [term] = await selectTermById(Number(id))
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await selectRecentTerm(1)
  return terms
}
