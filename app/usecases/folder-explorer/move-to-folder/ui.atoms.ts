import { atomWithReset } from "jotai/utils"

type DestFolder = { id: number | null; name: string }
export const destFolder$ = atomWithReset<DestFolder | null>(null)

export const filesToMove$ = atomWithReset<Map<number, string>>(new Map<number, string>())
export const foldersToMove$ = atomWithReset<Map<number, string>>(new Map<number, string>())
