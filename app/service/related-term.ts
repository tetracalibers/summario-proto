import { selectAllRelatedTerms, selectTermsWithoutId } from "~/db/query"
import { sortTermsByNearestFolder } from "./folder"
import type { Term } from "~/db/schema"

/**
 * 指定された用語IDに関連するすべての用語を取得する
 * @param termId 中心となる用語ID
 */
// export const findRelatedTerms = async (centerTerm: Term) => {
//   // termId を含むすべてのエッジを取得
//   const edges = await selectAllEdgesByTermId(centerTerm.id)

//   // 関連するすべての termId をユニークに抽出
//   const relatedTermIds = [
//     ...new Set(edges.flatMap((edge) => [edge.sourceTermId, edge.targetTermId]))
//   ]

//   if (relatedTermIds.length === 0) {
//     // 関連が見つからない場合は中心ノードだけを返す
//     return { nodes: [centerTerm], edges: [] }
//   }

//   // 関連するすべての用語情報を取得
//   const relatedTerms = await selectAllRelatedTerms(relatedTermIds)

//   return {
//     nodes: relatedTerms,
//     edges: edges.map((edge) => ({
//       source: edge.sourceTermId,
//       target: edge.targetTermId
//     }))
//   }
// }

export const getRelatedTerms = async (centerId: number) => {
  return selectAllRelatedTerms(centerId)
}

export const getRelatedTermsSuggestions = async (currentTerm: Term) => {
  const terms = await selectTermsWithoutId(currentTerm.id)
  return sortTermsByNearestFolder(terms, currentTerm.folderId)
}
