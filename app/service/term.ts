import { selectRecentTerm, selectTermById } from "~/db/query"
import {
  deleteAliases,
  deleteTermEdges,
  insertAliases,
  insertTermEdges,
  updateTermContent
} from "~/db/update"

export const getTermById = async (id: number) => {
  const [term] = await selectTermById(id)
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await selectRecentTerm(1)
  return terms
}

export const saveTermContentAndMeta = async (
  termId: number,
  payload: {
    content: any
    alias: { add: string[]; remove: number[] }
    related: { add: number[]; remove: number[] }
  }
) => {
  // すべて非同期に実行
  const { content, alias, related } = payload
  return Promise.all([
    // content
    updateTermContent(termId, content),
    // alias
    alias.add && alias.add.length > 0 ? insertAliases(termId, alias.add) : Promise.resolve(),
    alias.remove && alias.remove.length > 0 ? deleteAliases(alias.remove) : Promise.resolve(),
    // related
    related.add && related.add.length > 0
      ? insertTermEdges(termId, related.add)
      : Promise.resolve(),
    related.remove && related.remove.length > 0
      ? deleteTermEdges(termId, related.remove)
      : Promise.resolve()
  ])
}
