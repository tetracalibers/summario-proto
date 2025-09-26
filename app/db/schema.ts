import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  folderId: integer('folder_id').references(() => folders.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aliases = pgTable('aliases', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  noteId: integer('note_id')
    .references(() => notes.id)
    .notNull(),
});

export const relatedNotes = pgTable(
  'related_notes',
  {
    noteAId: integer('note_a_id')
      .references(() => notes.id)
      .notNull(),
    noteBId: integer('note_b_id')
      .references(() => notes.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteAId, t.noteBId] }),
  }),
);

export const folderRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'parent_folder',
  }),
  children: many(folders, { relationName: 'parent_folder' }),
  notes: many(notes),
}));

export const noteRelations = relations(notes, ({ one, many }) => ({
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  aliases: many(aliases),
  relatedNotesA: many(relatedNotes, { relationName: 'note_a' }),
  relatedNotesB: many(relatedNotes, { relationName: 'note_b' }),
}));

export const aliasRelations = relations(aliases, ({ one }) => ({
  note: one(notes, {
    fields: [aliases.noteId],
    references: [notes.id],
  }),
}));

export const relatedNoteRelations = relations(relatedNotes, ({ one }) => ({
  noteA: one(notes, {
    fields: [relatedNotes.noteAId],
    references: [notes.id],
    relationName: 'note_a',
  }),
  noteB: one(notes, {
    fields: [relatedNotes.noteBId],
    references: [notes.id],
    relationName: 'note_b',
  }),
}));
