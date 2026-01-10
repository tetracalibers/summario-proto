export interface MoveSuccess {
  ok: true
  files: { type: string; id: number; name: string }[]
  folders: { type: string; id: number; name: string }[]
}

export interface MoveFailure {
  ok: false
  rejected: { reason: any; name: string; type: "file" | "folder" }[]
}
