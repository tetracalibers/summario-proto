export type EntryType = "folder" | "file"

export interface FolderMutationSuccess {
  ok: true
  id: number
  name: string
}
