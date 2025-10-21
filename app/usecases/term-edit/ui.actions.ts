import { atom } from "jotai"
import type { RelatedTerm } from "~/units/related-term/types"
import { serverRelatedTerm$, uiRelatedTermLabel$ } from "~/units/related-term/ui.atoms"
import { serverAlias$, uiAliasLabel$ } from "~/units/alias/ui.atoms"
import type { Alias } from "~/units/alias/types"

// サーバから読んだ“正”を反映（初期化/再同期）
export const applyServerAliasSnapshot$ = atom(
  null,
  (get, set, created: Alias[], removed: Alias[]) => {
    // serverData に created を追加、removed を削除
    const data = new Map(get(serverAlias$))
    created.forEach((item) => data.set(item.title, item.id))
    removed.forEach((item) => data.delete(item.title))

    set(serverAlias$, data)
    set(uiAliasLabel$, Array.from(data.keys())) // UIも同期
  }
)

export const applyServerRelatedTermSnapshot$ = atom(
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
