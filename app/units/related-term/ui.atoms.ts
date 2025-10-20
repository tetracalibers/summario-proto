import { atom } from "jotai"
import type { RelatedTermId, RelatedTermLabel } from "./types"

// サーバーからの元状態（label→id）
export const serverRelatedTerm$ = atom<Map<RelatedTermLabel, RelatedTermId>>(
  new Map<RelatedTermLabel, RelatedTermId>()
)
// サーバーからの候補一覧（label→id）
export const optionsRelatedTerm$ = atom<Map<RelatedTermLabel, RelatedTermId>>(
  new Map<RelatedTermLabel, RelatedTermId>()
)

/**
 * UIに現在表示されているタイトル配列
 * 入力欄 onChange(values) をそのまま反映する“編集中”の状態
 */
export const uiRelatedTermLabel$ = atom<RelatedTermLabel[]>([])
