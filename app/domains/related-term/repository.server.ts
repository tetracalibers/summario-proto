import { db } from "~/db/connection"
import { terms, termEdges } from "~/db/schema"
import { eq, or, and } from "drizzle-orm"

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
