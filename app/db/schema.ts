// drizzle/schema.ts
import { relations } from "drizzle-orm"
import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  primaryKey,
  unique,
  index
} from "drizzle-orm/pg-core"

// ------------------------------
// folders: Adjacency List
// ------------------------------
export const folders = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    parentId: integer("parent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    // 同階層（親が同じ）での重名禁止
    unique("uniq_folders_parent_name").on(t.parentId, t.name),
    // ツリー系のCTE探索を速くする補助（parent_id 用）
    index("idx_folders_parent").on(t.parentId)
  ]
)

export const folderRelations = relations(folders, ({ many, one }) => ({
  children: many(folders, { relationName: "folder_children" }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: "folder_children"
  })
}))

// ------------------------------
// terms: 用語ノート本体
// ------------------------------
export const terms = pgTable(
  "terms",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull().default(""), // HTML文字列
    folderId: integer("folder_id").references(() => folders.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    // タイトル検索向け（LIKE/ILIKE/トライグラム）用
    index("idx_terms_title").on(t.title),
    index("idx_terms_folder").on(t.folderId)
  ]
)

export const termsRelations = relations(terms, ({ one, many }) => ({
  folder: one(folders, {
    fields: [terms.folderId],
    references: [folders.id]
  }),
  aliases: many(termAliases),
  // 関連（双方向）。実体は term_relations 側に保持。
  relationsFrom: many(termEdges, { relationName: "relations_from" }),
  relationsTo: many(termEdges, { relationName: "relations_to" })
}))

// ------------------------------
// term_aliases: エイリアス（複数）
// ------------------------------
export const termAliases = pgTable(
  "term_aliases",
  {
    id: serial("id").primaryKey(),
    termId: integer("term_id")
      .references(() => terms.id, { onDelete: "cascade" })
      .notNull(),
    alias: varchar("alias", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [
    // 同じ term 内で同じ alias を重複禁止
    unique("uniq_alias_per_term").on(t.termId, t.alias),
    // 検索最適化
    index("idx_term_aliases_alias").on(t.alias),
    index("idx_term_aliases_term").on(t.termId)
  ]
)

export const aliasRelations = relations(termAliases, ({ one }) => ({
  term: one(terms, {
    fields: [termAliases.termId],
    references: [terms.id]
  })
}))

// ------------------------------
// term_relations: 用語間の双方向（無向グラフ）
// 「(a, b) と (b, a) は同じ」→ 片側だけ保持
// ------------------------------
export const termEdges = pgTable(
  "term_edges",
  {
    // 便宜上 from/to として定義するが、DB 側で (min, max) に正規化し、無向性を担保
    sourceTermId: integer("source_term_id")
      .references(() => terms.id, { onDelete: "cascade" })
      .notNull(),
    targetTermId: integer("target_term_id")
      .references(() => terms.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (t) => [primaryKey({ name: "pk_term_edges", columns: [t.sourceTermId, t.targetTermId] })]
)

export const termEdgesLinks = relations(termEdges, ({ one }) => ({
  from: one(terms, {
    fields: [termEdges.sourceTermId],
    references: [terms.id],
    relationName: "relation_from"
  }),
  to: one(terms, {
    fields: [termEdges.targetTermId],
    references: [terms.id],
    relationName: "relation_to"
  })
}))
