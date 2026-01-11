import * as TermService from "~/units/term/service.server"
import * as FolderService from "~/units/folder/service.server"
import type { EntriesResults, MoveResult } from "./types"
import { debugLog } from "~/libs/debug.server"

interface MovePayload {
  targets: {
    file: { ids: number[]; names: string[] }
    folder: { ids: number[]; names: string[] }
  }
  newParentId: number | null
}

export const moveEntriesIntoSubfolder = async ({
  targets,
  newParentId
}: MovePayload): Promise<MoveResult> => {
  debugLog(targets)

  const results = await Promise.allSettled([
    TermService.moveTerms(targets.file.ids, newParentId),
    FolderService.moveFolders(targets.folder.ids, newParentId)
  ])

  const rejected = results.filter((r) => r.status === "rejected").length
  const status = rejected === 0 ? "ALL_SUCCEEDED" : "HAS_FAILURES"

  const [files, folders] = results
  const filesResult: EntriesResults = (() => {
    const status = files.status === "fulfilled" ? "SUCCESS" : "FAILURE"
    return { status, count: targets.file.ids.length, ...targets.file }
  })()
  const foldersResult: EntriesResults = (() => {
    const status = folders.status === "fulfilled" ? "SUCCESS" : "FAILURE"
    return { status, count: targets.folder.ids.length, ...targets.folder }
  })()

  return {
    status,
    details: [
      { type: "file", ...filesResult },
      { type: "folder", ...foldersResult }
    ]
  }
}
