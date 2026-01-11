export interface MoveSuccess {
  ok: true
  files: { id: number; name: string }[]
  folders: { id: number; name: string }[]
}

export interface MoveFailure {
  ok: false
  rejected: { reason: any; name: string; type: "file" | "folder" }[]
}
