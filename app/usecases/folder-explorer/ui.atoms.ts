import { atom } from "jotai"

export const folderId$ = atom<number | "root" | null>(null)
