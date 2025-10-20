import { atom } from "jotai"

export const termId$ = atom<number | null>(null)
export const isSaving$ = atom(false)
