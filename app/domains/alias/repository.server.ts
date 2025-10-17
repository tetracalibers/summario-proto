import { db } from "~/db/connection"
import { termAliases } from "~/db/schema"
import { eq } from "drizzle-orm"

export const findAllAliasesByTermId = async (termId: string) => {
  const rows = await db
    .select({ id: termAliases.id, title: termAliases.title })
    .from(termAliases)
    .where(eq(termAliases.termId, Number(termId)))

  return rows
}
