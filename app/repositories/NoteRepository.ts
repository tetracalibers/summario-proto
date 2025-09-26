import { eq, or, like, inArray } from 'drizzle-orm';
import * as schema from '~/db/schema';

// TODO: DB connection setup
// import { db } from '~/db';

/**
 * Repository for notes
 */
import { db } from '~/db/connection';

export class NoteRepository {
  async create(data: {
    title: string;
    content?: string;
    folderId?: number;
    aliases?: string[];
  }) {
    return db.transaction(async (tx) => {
      const [createdNote] = await tx
        .insert(schema.notes)
        .values({
          title: data.title,
          content: data.content,
          folderId: data.folderId,
        })
        .returning();

      if (data.aliases && data.aliases.length > 0) {
        await tx.insert(schema.aliases).values(
          data.aliases.map((alias) => ({
            name: alias,
            noteId: createdNote.id,
          })),
        );
      }

      return createdNote;
    });
  }

  async findById(id: number) {
    return db.query.notes.findFirst({
      where: eq(schema.notes.id, id),
      with: {
        aliases: true,
        relatedNotesA: {
          with: {
            noteB: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
        relatedNotesB: {
          with: {
            noteA: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: number,
    data: {
      title?: string;
      content?: string;
      aliases?: { name: string }[];
    },
  ) {
    return db.transaction(async (tx) => {
      if (data.title || data.content) {
        await tx
          .update(schema.notes)
          .set({
            title: data.title,
            content: data.content,
            updatedAt: new Date(),
          })
          .where(eq(schema.notes.id, id));
      }

      if (data.aliases) {
        await tx.delete(schema.aliases).where(eq(schema.aliases.noteId, id));
        await tx.insert(schema.aliases).values(
          data.aliases.map((alias) => ({
            name: alias.name,
            noteId: id,
          })),
        );
      }

      return this.findById(id);
    });
  }

  async delete(id: number) {
    return db.transaction(async (tx) => {
      await tx
        .delete(schema.relatedNotes)
        .where(or(eq(schema.relatedNotes.noteAId, id), eq(schema.relatedNotes.noteBId, id)));
      await tx.delete(schema.aliases).where(eq(schema.aliases.noteId, id));
      await tx.delete(schema.notes).where(eq(schema.notes.id, id));
    });
  }

  async search(keyword: string) {
    const subquery = db
      .select({ noteId: schema.aliases.noteId })
      .from(schema.aliases)
      .where(like(schema.aliases.name, `%${keyword}%`));

    return db
      .select()
      .from(schema.notes)
      .where(
        or(
          like(schema.notes.title, `%${keyword}%`),
          inArray(schema.notes.id, subquery),
        ),
      );
  }
}
