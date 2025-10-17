import { debugLog } from "~/lib/debug"
import * as TermRepository from "./repository.server"

export const getTerm = async (id: string) => {
  const [term] = await TermRepository.findTermById(id)
  debugLog(term)
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await TermRepository.findRecentTerm({ limit: 1 })
  return terms
}
