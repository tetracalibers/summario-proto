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

export const createFileNodeId = (termId: string | number): string => {
  return FILE_NODE_ID_PREFIX + termId
}

export const createFolderNodeId = (folderId: string | number): string => {
  return FOLDER_NODE_ID_PREFIX + folderId
}

export const createEdgeId = (sourceId: string, targetId: string): string => {
  return `${sourceId}--${targetId}`
}

// ref: https://qiita.com/coa00/items/679b0b5c7c468698d53f
const generateRandomId = (): string => {
  const strong = 1000
  return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}

export const createTmpFileNodeId = (): string => {
  return createFileNodeId(generateRandomId())
}

export const createTmpFolderNodeId = (): string => {
  return createFolderNodeId(generateRandomId())
}
