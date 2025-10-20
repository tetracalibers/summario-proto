import { db } from "~/db/connection"
import { terms } from "~/db/schema"
import { eq, desc } from "drizzle-orm"
import type { JSONContent } from "@tiptap/react"

export const findAllTerms = async () => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)

  return rows
}

export const findTermById = async (id: number) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)
    .where(eq(terms.id, id))

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

export const updateTermContent = async (termId: number, content: JSONContent) => {
  return db
    .update(terms)
    .set({ content })
    .where(eq(terms.id, termId))
    .returning({ id: terms.id, title: terms.title })
}
