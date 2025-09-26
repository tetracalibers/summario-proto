import { json, useLoaderData, Link } from 'react-router-dom';
import { NoteService } from '~/services/NoteService';

export async function loader() {
  const noteService = new NoteService();
  // TODO: Implement search from query params
  const notes = await noteService.searchNotes('');
  return json({ notes });
}

export default function NotesIndex() {
  const { notes } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div>
      <h1>Notes</h1>
      <Link to="/notes/new">Create Note</Link>
      {/* TODO: Add search form */}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
