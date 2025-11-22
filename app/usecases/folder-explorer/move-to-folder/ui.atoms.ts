import { atom } from "jotai"

export const destinationFolderId$ = atom<number | "root" | null>(null)
export const fileIdsToMove$ = atom<number[]>([])
export const folderIdsToMove$ = atom<number[]>([])
