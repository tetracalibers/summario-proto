import * as TermService from "~/units/term/service.server"
import * as FolderService from "~/units/folder/service.server"
import type { MoveFailure, MoveSuccess } from "./types"
import { debugLog } from "~/libs/debug.server"

interface MovePayload {
  targets: {
    files: Map<number, string>
    folders: Map<number, string>
  }
  newParentId: number | null
}

export const moveEntriesIntoSubfolder = async ({
  targets,
  newParentId
}: MovePayload): Promise<MoveSuccess | MoveFailure> => {
  debugLog(targets)

  const results = await Promise.allSettled([
    TermService.moveTerms([...targets.files.keys()], newParentId),
    FolderService.moveFolders([...targets.folders.keys()], newParentId)
  ])

  const targetDetails = [
    ...[...targets.files.values()].map((name) => ({ type: "file", name }) as const),
    ...[...targets.folders.values()].map((name) => ({ type: "folder", name }) as const)
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
    files: filesResult.status === "fulfilled" ? [filesResult.value] : [],
    folders: foldersResult.status === "fulfilled" ? [foldersResult.value] : []
  }
}
