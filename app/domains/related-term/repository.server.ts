import { db } from "~/db/connection"
import { terms, termEdges } from "~/db/schema"
import { eq, or, and, inArray } from "drizzle-orm"

// 関連ノード（双方向）をすべて取得
export const findAllRelatedTerms = async (termId: string) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title })
    .from(terms)
    .innerJoin(
      termEdges,
      or(
        and(eq(termEdges.sourceTermId, terms.id), eq(termEdges.targetTermId, Number(termId))),
        and(eq(termEdges.targetTermId, terms.id), eq(termEdges.sourceTermId, Number(termId)))
      )
    )

  return rows
}

export const createTermRelations = async (termId: number, relatedTermIds: number[]) => {
  if (relatedTermIds.length === 0) return []

  // source/target を小さい順にそろえて無向辺の重複を防ぐ
  const edgeValues = relatedTermIds.map((relatedId) => {
    const [sourceTermId, targetTermId] =
      termId < relatedId ? [termId, relatedId] : [relatedId, termId]
    return { sourceTermId, targetTermId }
  })

  // INSERT ... ON CONFLICT DO NOTHING RETURNING ... を CTE 化
  const ins = db.$with("ins").as(
    db.insert(termEdges).values(edgeValues).onConflictDoNothing().returning({
      sourceId: termEdges.sourceTermId,
      targetId: termEdges.targetTermId
    })
  )

  // CTE で返った source/target に紐づく terms をそのまま 1 ステートメントで取得
  const rows = await db
    .with(ins)
    .selectDistinct({ id: terms.id, title: terms.title })
    .from(terms)
    .where(
      or(
        inArray(terms.id, db.select({ id: ins.sourceId }).from(ins)),
        inArray(terms.id, db.select({ id: ins.targetId }).from(ins))
      )
    )

  return rows
}

export const deleteTermRelations = async (termId: number, relatedTermIds: number[]) => {
  if (relatedTermIds.length === 0) return []

  // DELETE ... RETURNING を CTE 化
  const del = db.$with("del").as(
    db
      .delete(termEdges)
      .where(
        or(
          and(eq(termEdges.sourceTermId, termId), inArray(termEdges.targetTermId, relatedTermIds)),
          and(eq(termEdges.targetTermId, termId), inArray(termEdges.sourceTermId, relatedTermIds))
        )
      )
      .returning({
        sourceId: termEdges.sourceTermId,
        targetId: termEdges.targetTermId
      })
  )

  // 直前に削除されたエッジに関係する term だけを返す（重複は DISTINCT で排除）
  const rows = await db
    .with(del)
    .selectDistinct({ id: terms.id, title: terms.title })
    .from(terms)
    .where(
      or(
        inArray(terms.id, db.select({ id: del.sourceId }).from(del)),
        inArray(terms.id, db.select({ id: del.targetId }).from(del))
      )
    )

  return rows
}
