# Term Note CRUD Implementation Log

## 2025-09-27

*   Created directories: `app/repositories`, `app/services`, `@doc`
*   Created `app/repositories/NoteRepository.ts` and defined the class structure.
*   Set up the database connection in `app/db/connection.ts`.
*   Implemented all CRUD and search methods in `NoteRepository`.
*   Fixed a bug in the `search` method by using `inArray`.
*   Created `app/services/NoteService.ts` to connect business logic with the repository.
*   Switched to file-based routing as per React Router v6 framework guidelines.
*   Created `app/routes/notes._index.tsx` with a loader to display a list of notes.
*   Created `app/routes/notes.new.tsx` with an action to handle new note creation.
*   Created `app/routes/notes.$noteId.tsx` with a loader for fetching a note and actions for updating and deleting it.
