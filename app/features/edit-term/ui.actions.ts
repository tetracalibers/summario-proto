import { atom, useAtomValue, useSetAtom } from "jotai"
import { isCanSave$, termMetaDiff$ } from "./ui.selectors"
import { isSaving$ } from "./ui.atoms"
import { isDirtyContent$ } from "~/aggregates/term/ui.atoms"
import type { RelatedTerm } from "~/aggregates/related-term/types"
import { serverRelatedTerm$, uiRelatedTermLabel$ } from "~/aggregates/related-term/ui.atoms"
import { serverAlias$, uiAliasLabel$ } from "~/aggregates/alias/ui.atoms"
import type { Alias } from "~/aggregates/alias/types"

// サーバから読んだ“正”を反映（初期化/再同期）
const applyServerAliasSnapshot$ = atom(null, (get, set, created: Alias[], removed: Alias[]) => {
  // serverData に created を追加、removed を削除
  const data = new Map(get(serverAlias$))
  created.forEach((item) => data.set(item.title, item.id))
  removed.forEach((item) => data.delete(item.title))

  set(serverAlias$, data)
  set(uiAliasLabel$, Array.from(data.keys())) // UIも同期
})
const applyServerRelatedTermSnapshot$ = atom(
  null,
  (get, set, created: RelatedTerm[], removed: RelatedTerm[]) => {
    // serverData に created を追加、removed を削除
    const data = new Map(get(serverRelatedTerm$))
    created.forEach((item) => data.set(item.title, item.id))
    removed.forEach((item) => data.delete(item.title))

    set(serverRelatedTerm$, data)
    set(uiRelatedTermLabel$, Array.from(data.keys())) // UIも同期
  }
)

export function useTermContentSaveUi() {
  const setIsSaving = useSetAtom(isSaving$)
  const isCanSave = useAtomValue(isCanSave$)
  const isDirtyEditor = useAtomValue(isDirtyContent$)
  const termMetaDiff = useAtomValue(termMetaDiff$)

  const applyServerAliasSnapshot = useSetAtom(applyServerAliasSnapshot$)
  const applyServerRelatedTermSnapshot = useSetAtom(applyServerRelatedTermSnapshot$)

  return {
    termMetaDiff,
    isCanSave,
    isDirtyEditor,
    setIsSaving,
    applyServerAliasSnapshot,
    applyServerRelatedTermSnapshot
  }
}
