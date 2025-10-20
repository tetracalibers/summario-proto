import { debugLog } from "~/libs/debug.server"
import * as TermRepository from "./repository.server"
import type { JSONContent } from "@tiptap/react"

export const getAllTerms = async () => {
  return await TermRepository.findAllTerms()
}

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

export const updateTermContent = async (termId: number, content: JSONContent) => {
  return TermRepository.updateTermContent(termId, content)
}
