import { selectAllRelatedTerms, selectOutgoingEdgesBySourceIds, selectTermById } from "~/db/query"

/** エッジの重複排除（同一 source-target を 1 本に） */
const dedupeEdges = (edges: { source: number; target: number }[]) => {
  const seen = new Set<string>()
  const deduped: { source: number; target: number }[] = []

  for (const edge of edges) {
    const key = `${edge.source}-${edge.target}`
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(edge)
    }
  }

  return deduped
}

/**
 * 指定された用語IDに関連する用語を、outgoing 方向に depth 層ぶん取得する
 * @param termId 中心となる用語ID
 * @param depth 展開深さ（1以上）
 */
export const findRelatedTermsDeep = async (termId: number, depth: number) => {
  if (depth <= 0) {
    const centerTerm = await selectTermById(termId)
    return {
      nodes: centerTerm ?? [],
      edges: [] as { source: number; target: number }[]
    }
  }

  const visited = new Set<number>([termId]) // ノード重複・循環防止
  const allNodeIds = new Set<number>([termId]) // 返却用ノードID集合
  const allEdges: { source: number; target: number }[] = []

  let frontier = [termId] // 現在レベルで探索する sourceTermId 群

  for (let d = 1; d <= depth; d++) {
    if (frontier.length === 0) break

    // 1レベルぶんをまとめて取得（N+1回避）
    const edges = await selectOutgoingEdgesBySourceIds(frontier)

    const nextFrontier: number[] = []

    for (const e of edges) {
      const src = e.sourceTermId
      const dst = e.targetTermId

      // エッジは常に保持（可視化/関係復元に必要）
      allEdges.push({ source: src, target: dst })

      if (!visited.has(dst)) {
        visited.add(dst)
        allNodeIds.add(dst)
        nextFrontier.push(dst)
      }
      // src 側もノード集合に入れておく（初回以外で新規 src が現れるケースに備え）
      allNodeIds.add(src)
    }

    frontier = nextFrontier
  }

  // ノード情報をまとめて取得（中心ノードも含まれる）
  const nodes = allNodeIds.size ? await selectAllRelatedTerms(Array.from(allNodeIds)) : []

  return {
    nodes,
    edges: dedupeEdges(allEdges)
  }
}
