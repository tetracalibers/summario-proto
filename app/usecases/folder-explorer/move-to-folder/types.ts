export type EntriesResults = {
  status: "SUCCESS" | "FAILURE"
  count: number
  ids: number[]
  names: string[]
}

export type MoveResult = {
  status: "ALL_SUCCEEDED" | "HAS_FAILURES"
  details: Array<{ type: "file" | "folder" } & EntriesResults>
}
