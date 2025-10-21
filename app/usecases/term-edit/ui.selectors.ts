import { atom } from "jotai"
import { aliasDiff$, isDirtyAlias$ } from "~/units/alias/ui.selectors"
import { isDirtyRelatedTerm$, relatedTermDiff$ } from "~/units/related-term/ui.selectors"
import { isDirtyContent$ } from "~/units/term/ui.atoms"

export const isCanSave$ = atom((get) => {
  const isDirtyAlias = get(isDirtyAlias$)
  const isDirtyRelated = get(isDirtyRelatedTerm$)
  const isDirtyEditor = get(isDirtyContent$)
  return [isDirtyAlias, isDirtyRelated, isDirtyEditor].some(Boolean)
})

export const termMetaDiff$ = atom((get) => {
  const alias = get(aliasDiff$)
  const related = get(relatedTermDiff$)
  return { alias, related }
})
