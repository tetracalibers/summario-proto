import { atom } from "jotai"
import { aliasSavePayloadAtom, dirtyAliasAtom } from "../alias-input/atoms"
import { dirtyRelatedAtom, relatedSavePayloadAtom } from "../related-input/atoms"
import { dirtyEditorAtom } from "../editor/atoms"

export const savingStateAtom = atom<"idle" | "loading" | "submitting">("idle")

export const canSaveAtom = atom((get) => {
  const isDirtyAlias = get(dirtyAliasAtom)
  const isDirtyRelated = get(dirtyRelatedAtom)
  const isDirtyEditor = get(dirtyEditorAtom)
  return [isDirtyAlias, isDirtyRelated, isDirtyEditor].some(Boolean)
})

export const saveMetaPayloadAtom = atom((get) => {
  const alias = get(aliasSavePayloadAtom)
  const related = get(relatedSavePayloadAtom)
  return { alias, related }
})
