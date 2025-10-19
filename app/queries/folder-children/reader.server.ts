import * as FolderChildrenReadStore from "../folder-children/readstore.server"

export const getFolderChildren = async (folderId: number | null) => {
  const [folders, files] = await Promise.all([
    FolderChildrenReadStore.findChildrenFolders(folderId),
    FolderChildrenReadStore.findChildrenFiles(folderId)
  ])
  return { folders, files }
}
