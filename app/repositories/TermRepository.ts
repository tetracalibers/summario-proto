import { desc, eq, ilike, or } from "drizzle-orm"
import { db } from "~/db/connection"
import { termAliases, terms } from "~/db/schema"

type CreateTerm = {
  title: string
  content: string
  folderId?: number | null
  aliases?: string[]
}

export class TermRepository {
  // 用語を新規作成
  async create({ title, content, folderId = null, aliases = [] }: CreateTerm) {
    return await db.transaction(async (tx) => {
      const [newTerm] = await tx.insert(terms).values({ title, content, folderId }).returning()

      if (aliases.length > 0) {
        const aliasValues = aliases.map((alias) => ({
          termId: newTerm.id,
          alias
        }))
        await tx.insert(termAliases).values(aliasValues)
      }
      return newTerm
    })
  }

  // IDで用語を検索（エイリアスも含む）
  async findById(id: number) {
    return await db.query.terms.findFirst({
      where: eq(terms.id, id),
      with: {
        aliases: true
      }
    })
  }

  // 用語を更新
  async update(id: number, { title, content, folderId, aliases }: Partial<CreateTerm>) {
    return await db.transaction(async (tx) => {
      // 用語本体の更新
      if (title || content || folderId) {
        await tx
          .update(terms)
          .set({ title, content, folderId, updatedAt: new Date() })
          .where(eq(terms.id, id))
      }

      // エイリアスの更新（一旦全削除して再作成）
      if (aliases) {
        await tx.delete(termAliases).where(eq(termAliases.termId, id))
        if (aliases.length > 0) {
          const aliasValues = aliases.map((alias) => ({
            termId: id,
            alias
          }))
          await tx.insert(termAliases).values(aliasValues)
        }
      }

      return await this.findById(id)
    })
  }

  // 用語を削除
  async delete(id: number) {
    // 関連エイリアスは cascade で自動削除される
    const [deleted] = await db.delete(terms).where(eq(terms.id, id)).returning()
    return deleted
  }

  // キーワードで検索
  async search(keyword: string) {
    const searchCondition = `%${keyword}%`
    // SELECT DISTINCT terms.* FROM terms
    // LEFT JOIN term_aliases ON terms.id = term_aliases.termId
    // WHERE terms.title ILIKE '%keyword%' OR term_aliases.alias ILIKE '%keyword%'
    const results = await db
      .select({
        id: terms.id,
        title: terms.title,
        content: terms.content,
        folderId: terms.folderId,
        createdAt: terms.createdAt,
        updatedAt: terms.updatedAt
      })
      .from(terms)
      .leftJoin(termAliases, eq(terms.id, termAliases.termId))
      .where(or(ilike(terms.title, searchCondition), ilike(termAliases.alias, searchCondition)))
      .groupBy(terms.id)
      .orderBy(desc(terms.updatedAt))

    return results
  }
}
