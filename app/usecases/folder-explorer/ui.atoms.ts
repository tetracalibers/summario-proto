import { atom } from "jotai"
import { atomWithToggle } from "~/libs/jotai-utils/functional-atom"
import type { Entry } from "./types"
import { atomWithReset } from "jotai/utils"

export const folderId$ = atom<number | "root" | null>(null)

export const locked$ = atomWithToggle(true)
export const selectedEntries$ = atomWithReset<Set<Entry>>(new Set<Entry>())
