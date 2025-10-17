import { db } from "~/db/connection"
import { terms } from "~/db/schema"
import { eq, desc } from "drizzle-orm"

export const findAllTerms = async () => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)

  return rows
}

export const findTermById = async (id: string) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)
    .where(eq(terms.id, Number(id)))

  return rows
}

export const findRecentTerm = async ({ limit = 1 }) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)
    .orderBy(desc(terms.updatedAt))
    .limit(limit)

  return rows
}
