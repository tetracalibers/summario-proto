import { atom } from "jotai"
import type { TermNode } from "./types"

export const centerNode$ = atom<TermNode | null>(null)
