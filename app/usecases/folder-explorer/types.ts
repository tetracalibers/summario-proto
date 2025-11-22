export type EntryType = "folder" | "file"

export interface Entry {
  id: number
  type: EntryType
}

export interface FolderMutationSuccess {
  ok: true
  id: number
  name: string
}
