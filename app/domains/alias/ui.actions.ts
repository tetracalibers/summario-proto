import { useSetAtom } from "jotai"
import { serverAlias$, uiAliasLabel$ } from "./ui.atoms"
import { useHydrateAtoms } from "jotai/react/utils"
import type { Alias } from "./types"

/**
 * エディタ側など“書く側”が使うアクション。
 * - 書き込み点を1箇所に固定し、他featureからの直接setを禁止できる
 */
export function useAliasUi(initials: Alias[]) {
  useHydrateAtoms([
    [serverAlias$, new Map(initials.map((item) => [item.title, item.id]))],
    [uiAliasLabel$, initials.map((item) => item.title)]
  ])

  const setUiValues = useSetAtom(uiAliasLabel$)

  return { setUiValues }
}
