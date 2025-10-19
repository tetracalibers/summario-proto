import { desc, asc, ne } from "drizzle-orm"
import { db } from "~/db/connection"
import { folders, terms } from "~/db/schema"

export const selectAllTerms = async () => {
  return await db.select().from(terms)
}

export const selectTermsWithoutId = async (excludeId: number) => {
  return db.select().from(terms).where(ne(terms.id, excludeId)).orderBy(desc(terms.updatedAt))
}

export const selectAllFolders = async () => {
  return db.select().from(folders).orderBy(asc(folders.parentId), asc(folders.id))
}
