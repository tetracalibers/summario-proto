import { db } from "~/db/connection"
import { termAliases, termEdges, terms } from "./schema"
import { eq, inArray, or, and } from "drizzle-orm"

export const updateTermContent = async (termId: number, content: string) => {
  return db
    .update(terms)
    .set({ content })
    .where(eq(terms.id, termId))
    .returning({ id: terms.id, title: terms.title })
}

export const insertAliases = async (termId: number, aliases: string[]) => {
  if (aliases.length === 0) return []
  return db
    .insert(termAliases)
    .values(aliases.map((title) => ({ termId, title })))
    .returning({ id: termAliases.id, title: termAliases.title })
}

export const deleteAliases = async (aliasIds: number[]) => {
  if (aliasIds.length === 0) return []
  return db
    .delete(termAliases)
    .where(inArray(termAliases.id, aliasIds))
    .returning({ id: termAliases.id, title: termAliases.title })
}

export const insertTermEdges = async (termId: number, relatedTermIds: number[]) => {
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

export const deleteTermEdges = async (termId: number, relatedTermIds: number[]) => {
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
