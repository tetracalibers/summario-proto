import * as TermService from "~/units/term/service.server"
import * as FolderService from "~/units/folder/service.server"
import type { MoveFailure, MoveSuccess } from "./types"
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
}: MovePayload): Promise<MoveSuccess | MoveFailure> => {
  debugLog(targets)

  const results = await Promise.allSettled([
    TermService.moveTerms(targets.file.ids, newParentId),
    FolderService.moveFolders(targets.folder.ids, newParentId)
  ])

  const targetDetails = [
    ...targets.file.names.map((name) => ({ type: "file", name }) as const),
    ...targets.folder.names.map((name) => ({ type: "folder", name }) as const)
  ]

  const rejected = results
    .flat()
    .filter((r) => r.status === "rejected")
    .map((r, i) => {
      const target = targetDetails[i]
      return { reason: r.reason, ...target }
    })

  if (rejected.length > 0) {
    console.error("Failed to move entries:", rejected)
    return { ok: false, rejected }
  }

  const [filesResult, foldersResult] = results

  return {
    ok: true,
    files: filesResult.status === "fulfilled" ? filesResult.value : [],
    folders: foldersResult.status === "fulfilled" ? foldersResult.value : []
  }
}
