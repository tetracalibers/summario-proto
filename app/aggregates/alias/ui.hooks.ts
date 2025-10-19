import { useSetAtom } from "jotai"
import { serverAlias$, uiAliasLabel$ } from "./ui.atoms"
import type { Alias } from "./types"
import { useSyncAtom } from "~/libs/jotai-utils/use-atom"

export function useAliasUi(initials: Alias[]) {
  useSyncAtom(serverAlias$, new Map(initials.map((item) => [item.title, item.id])))
  useSyncAtom(
    uiAliasLabel$,
    initials.map((item) => item.title)
  )

  const setUiValues = useSetAtom(uiAliasLabel$)

  return { setUiValues }
}
