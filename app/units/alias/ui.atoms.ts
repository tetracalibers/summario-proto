import { atom } from "jotai"
import type { AliasLabel, AliasId } from "./types"

// サーバから取得した“正”の状態（title→id）
export const serverAlias$ = atom<Map<AliasLabel, AliasId>>(new Map<AliasLabel, AliasId>())

/**
 * UIに現在表示されているタイトル配列
 * 入力欄 onChange(values) をそのまま反映する“編集中”の状態
 */
export const uiAliasLabel$ = atom<AliasLabel[]>([])
