import { json, redirect, Form } from 'react-router-dom';
import { NoteService } from '~/services/NoteService';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  // TODO: Add alias handling

  if (!title) {
    return json({ error: 'Title is required' }, { status: 400 });
  }

  const noteService = new NoteService();
  const newNote = await noteService.createNote({ title, content });

  return redirect(`/notes/${newNote.id}`);
}

export default function NewNote() {
  return (
    <div>
      <h1>Create New Note</h1>
      <Form method="post">
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" />
        </div>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
