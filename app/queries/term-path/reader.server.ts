import * as FolderService from "~/units/folder/service.server"
import * as TermService from "~/units/term/service.server"

export const getTermPath = async (termId: number) => {
  const folderId = await TermService.getTermParentFolderId(termId)
  if (folderId === null) return []
  return FolderService.getFolderPath(folderId)
}
