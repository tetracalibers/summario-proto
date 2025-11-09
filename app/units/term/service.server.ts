import { defaultContentJson } from "~/libs/tiptap-editor/utils"
import { debugLog } from "~/libs/debug.server"
import * as TermRepository from "./repository.server"
import type { JSONContent } from "@tiptap/react"

export const getAllTerms = async () => {
  return await TermRepository.findAll()
}

export const getTerm = async (id: number) => {
  const [term] = await TermRepository.findById(id)
  debugLog(term)
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await TermRepository.findRecent({ limit: 1 })
  return terms
}

export const updateTermContent = async (termId: number, title: string, content: JSONContent) => {
  return TermRepository.updateContent(termId, { title, content })
}

export const createEmptyTerm = async (title: string, folderId: number | null) => {
  const [newTerm] = await TermRepository.createEmpty({
    title,
    folderId,
    content: defaultContentJson(title)
  })
  return { id: newTerm.id, name: newTerm.title }
}
