export const FILE_NODE_TYPE = "file"
export const FOLDER_NODE_TYPE = "folder"

export interface FileNodeData extends Record<string, unknown> {
  label: string
  isContentEmpty: boolean
  tmp: boolean
}

export interface FolderNodeData extends Record<string, unknown> {
  label: string
  tmp: boolean
}
