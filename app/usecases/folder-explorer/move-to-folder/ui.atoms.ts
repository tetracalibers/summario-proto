import { atomWithReset } from "jotai/utils"

export const destinationFolderId$ = atomWithReset<number | "root" | null>(null)

export const fileIdsToMove$ = atomWithReset<Set<number>>(new Set<number>())
export const folderIdsToMove$ = atomWithReset<Set<number>>(new Set<number>())
