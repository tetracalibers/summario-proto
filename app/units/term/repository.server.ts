import { db } from "~/db/connection"
import { terms } from "~/db/schema"
import { eq, desc } from "drizzle-orm"
import type { JSONContent } from "@tiptap/react"

export const findAll = async () => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)

  return rows
}

export const findById = async (id: number) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)
    .where(eq(terms.id, id))

  return rows
}

export const findRecent = async ({ limit = 1 }) => {
  const rows = await db
    .select({ id: terms.id, title: terms.title, content: terms.content, folderId: terms.folderId })
    .from(terms)
    .orderBy(desc(terms.updatedAt))
    .limit(limit)

  return rows
}

interface UpdateContentData {
  title: string
  content: JSONContent
}
export const updateContent = async (termId: number, { title, content }: UpdateContentData) => {
  return db
    .update(terms)
    .set({ title, content })
    .where(eq(terms.id, termId))
    .returning({ id: terms.id, title: terms.title })
}

interface CreateData {
  title: string
  content: JSONContent
  folderId: number | null
}
export const createEmpty = async ({ title, folderId, content }: CreateData) => {
  return db
    .insert(terms)
    .values({ title, folderId, content })
    .returning({ id: terms.id, title: terms.title })
}
