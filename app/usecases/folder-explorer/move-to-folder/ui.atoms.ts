import { atomWithReset } from "jotai/utils"

type DestFolder = { id: number | null; name: string }
export const destFolder$ = atomWithReset<DestFolder | null>(null)

export const fileIdsToMove$ = atomWithReset<Set<number>>(new Set<number>())
export const folderIdsToMove$ = atomWithReset<Set<number>>(new Set<number>())
