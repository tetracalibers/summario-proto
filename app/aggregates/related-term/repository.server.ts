import { db } from "~/db/connection"
import { terms, termEdges } from "~/db/schema"
import { eq, or, and, inArray, sql } from "drizzle-orm"
import { debugLog } from "~/libs/debug.server"

// 関連ノード（双方向）をすべて取得
export const findAllByTermId = async (termId: number) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title })
    .from(terms)
    .innerJoin(
      termEdges,
      or(
        and(eq(termEdges.sourceTermId, terms.id), eq(termEdges.targetTermId, termId)),
        and(eq(termEdges.targetTermId, terms.id), eq(termEdges.sourceTermId, termId))
      )
    )

  debugLog(rows)

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
    db
      .insert(termEdges)
      .values(edgeValues)
      .onConflictDoNothing()
      .returning({
        otherId: sql<number>`
          CASE
            WHEN ${termEdges.sourceTermId} = ${termId} THEN ${termEdges.targetTermId}
            ELSE ${termEdges.sourceTermId}
          END
        `.as("otherId")
      })
  )

  // CTE で返った source/target に紐づく terms をそのまま 1 ステートメントで取得
  const rows = await db
    .with(ins)
    .selectDistinct({ id: terms.id, title: terms.title })
    .from(terms)
    .where(inArray(terms.id, db.select({ id: ins.otherId }).from(ins)))

  debugLog(rows)

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
        otherId: sql<number>`
          CASE
            WHEN ${termEdges.sourceTermId} = ${termId} THEN ${termEdges.targetTermId}
            ELSE ${termEdges.sourceTermId}
          END
        `.as("otherId")
      })
  )

  // 直前に削除されたエッジに関係する term だけを返す（重複は DISTINCT で排除）
  const rows = await db
    .with(del)
    .selectDistinct({ id: terms.id, title: terms.title })
    .from(terms)
    .where(inArray(terms.id, db.select({ id: del.otherId }).from(del)))

  return rows
}
