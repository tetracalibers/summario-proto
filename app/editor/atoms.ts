import { atom } from "jotai"
import type { BlockTypes } from "./blocks"

export const usedBlockTypesAtom = atom<BlockTypes[]>(["summary"])
