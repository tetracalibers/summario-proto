const FILE_NODE_ID_PREFIX = "term-"
const FOLDER_NODE_ID_PREFIX = "folder-"

export const parseFileNodeId = (id: string): string | null => {
  if (!id.startsWith(FILE_NODE_ID_PREFIX)) return null
  return id.slice(FILE_NODE_ID_PREFIX.length)
}

export const parseFolderNodeId = (id: string): string | null => {
  if (!id.startsWith(FOLDER_NODE_ID_PREFIX)) return null
  return id.slice(FOLDER_NODE_ID_PREFIX.length)
}

export const createFileNodeId = (termId: string): string => {
  return FILE_NODE_ID_PREFIX + termId
}

export const createFolderNodeId = (folderId: string): string => {
  return FOLDER_NODE_ID_PREFIX + folderId
}

const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

export const createTmpFileNodeId = (): string => {
  return createFileNodeId(generateRandomId())
}
