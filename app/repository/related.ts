import { eq, inArray } from "drizzle-orm"
import type { InferSelectModel } from "drizzle-orm"
import { db } from "~/db/connection"
import { terms, termEdges } from "~/db/schema"

type Term = InferSelectModel<typeof terms>

export type RelatedHop = {
  term: Term // 到達した用語
  fromTermId: number // どの用語から辿ったか（parent）
  depth: number // root からの距離（1..depth）
}

/**
 * 指定した termId から outgoing（自分→相手）のみを最大 depth まで辿って取得。
 * BFS のため、depth=1 は直接の子、depth=2 は“子の子”…というレベルで展開。
 * ループ/自己参照を避けるため visited を使用し、同一 term は最初に到達したレベルを優先。
 *
 * @param db Drizzle DB
 * @param rootId 開始する用語 id
 * @param depth 展開の最大深さ（1以上）
 * @returns RelatedHop[] 到達ノードの配列（到達順=概ねBFS順）
 */
export async function getOutgoingRelatedTermsDeep(
  rootId: number,
  depth: number
): Promise<RelatedHop[]> {
  if (depth <= 0) return []

  const results: RelatedHop[] = []
  const visited = new Set<number>([rootId]) // root 自身は既訪問扱い
  let frontier = [rootId] // 現在レベルで探索する sourceTermId 群

  for (let d = 1; d <= depth; d++) {
    if (frontier.length === 0) break

    // frontier をまとめてクエリ（N+1 回避）
    const rows = await db
      .select({
        fromId: termEdges.sourceTermId,
        toId: termEdges.targetTermId,
        term: terms
      })
      .from(termEdges)
      .innerJoin(terms, eq(terms.id, termEdges.targetTermId))
      .where(inArray(termEdges.sourceTermId, frontier))

    const nextFrontier: number[] = []

    for (const r of rows) {
      const toId = Number(r.toId)
      if (visited.has(toId)) continue // 既にどこかのレベルで到達済みならスキップ
      visited.add(toId)

      results.push({
        term: r.term,
        fromTermId: Number(r.fromId),
        depth: d
      })

      nextFrontier.push(toId)
    }

    frontier = nextFrontier
  }

  return results
}
