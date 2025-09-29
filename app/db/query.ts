import { eq, desc, asc } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, terms } from "~/db/schema"

export const selectTermById = async (id: number) => {
  return db.select().from(terms).where(eq(terms.id, id))
}

export const selectRecentTerm = async (limit = 1) => {
  return db.select().from(terms).orderBy(desc(terms.updatedAt)).limit(limit)
}

export const selectAllTerms = async () => {
  return await db.select().from(terms)
}

export const selectAllFolders = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}
