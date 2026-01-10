import * as TermService from "~/units/term/service.server"
import * as FolderService from "~/units/folder/service.server"
import type { MoveFailure, MoveSuccess } from "./types"

interface MovePayload {
  targets: {
    file: Map<number, { name: string; type: "file" }>[]
    folder: Map<number, { name: string; type: "folder" }>[]
  }
  newParentId: number | null
}

export const moveEntriesIntoSubfolder = async ({
  targets,
  newParentId
}: MovePayload): Promise<MoveSuccess | MoveFailure> => {
  const results = await Promise.allSettled([
    TermService.moveTerms([...targets.file.keys()], newParentId),
    FolderService.moveFolders([...targets.folder.keys()], newParentId)
  ])

  const targetDetails = [
    ...targets.file.flatMap((m) => [...m.values()]),
    ...targets.folder.flatMap((m) => [...m.values()])
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
