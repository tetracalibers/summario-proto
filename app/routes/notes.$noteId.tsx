import { json, redirect, useLoaderData, Form, useParams } from 'react-router-dom';
import { NoteService } from '~/services/NoteService';

export async function loader({ params }: { params: { noteId?: string } }) {
  if (!params.noteId) {
    throw new Response('Not Found', { status: 404 });
  }
  const noteService = new NoteService();
  const note = await noteService.getNoteById(Number(params.noteId));
  if (!note) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }: { request: Request; params: { noteId?: string } }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const noteService = new NoteService();
  const noteId = Number(params.noteId);

  if (intent === 'delete') {
    await noteService.deleteNote(noteId);
    return redirect('/notes');
  }

  if (intent === 'update') {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    await noteService.updateNote(noteId, { title, content });
    return redirect(`/notes/${noteId}`);
  }

  return json({ error: 'Invalid intent' }, { status: 400 });
}

export default function NoteDetail() {
  const { note } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div>
      <Form method="post">
        <input type="hidden" name="intent" value="update" />
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" defaultValue={note.title} />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" defaultValue={note.content ?? ''} />
        </div>
        <button type="submit">Update</button>
      </Form>

      <Form method="post" style={{ marginTop: '1rem' }}>
        <input type="hidden" name="intent" value="delete" />
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}
