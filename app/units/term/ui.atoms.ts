import { atom } from "jotai"

export const isDirtyContent$ = atom(false)
export const termTitle$ = atom<string | null>(null)
