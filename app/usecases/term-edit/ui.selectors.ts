import { atom } from "jotai"
import { aliasDiff$, isDirtyAlias$ } from "~/units/alias/ui.selectors"
import { isDirtyRelatedTerm$, relatedTermDiff$ } from "~/units/related-term/ui.selectors"
import { isDirtyContent$ } from "~/units/term/ui.atoms"
import { isEmptyTermTitle$ } from "~/units/term/ui.selectors"

export const isCanSave$ = atom((get) => {
  const isEmptyTitle = get(isEmptyTermTitle$)
  if (isEmptyTitle) return false

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
