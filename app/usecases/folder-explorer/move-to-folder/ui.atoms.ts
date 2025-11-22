import { atom } from "jotai"

export const destinationFolderId$ = atom<number | "root" | null>(null)

export const fileIdsToMove$ = atom<Set<number>>(new Set<number>())
export const folderIdsToMove$ = atom<Set<number>>(new Set<number>())
