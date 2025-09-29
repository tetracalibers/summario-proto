import { eq, desc } from "drizzle-orm"
import { db } from "~/db/connection"
import { terms } from "~/db/schema"

export const getTermById = async (id: number) => {
  return db.select().from(terms).where(eq(terms.id, id))
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async (limit = 1) => {
  return db.select().from(terms).orderBy(desc(terms.updatedAt)).limit(limit)
}
