import { NoteRepository } from '~/repositories/NoteRepository';

export class NoteService {
  private noteRepository: NoteRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
  }

  async createNote(data: {
    title: string;
    content?: string;
    folderId?: number;
    aliases?: string[];
  }) {
    return this.noteRepository.create(data);
  }

  async getNoteById(id: number) {
    return this.noteRepository.findById(id);
  }

  async updateNote(
    id: number,
    data: {
      title?: string;
      content?: string;
      aliases?: { name: string }[];
    },
  ) {
    return this.noteRepository.update(id, data);
  }

  async deleteNote(id: number) {
    return this.noteRepository.delete(id);
  }

  async searchNotes(keyword: string) {
    return this.noteRepository.search(keyword);
  }
}
