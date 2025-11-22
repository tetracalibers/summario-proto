import { atom } from "jotai"
import { atomWithToggle } from "~/libs/jotai-utils/functional-atom"

export const folderId$ = atom<number | "root" | null>(null)
export const locked$ = atomWithToggle(true)
