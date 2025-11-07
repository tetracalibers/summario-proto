import { useAtomValue, useSetAtom } from "jotai"
import { isDirtyContent$, termTitle$ } from "~/units/term/ui.atoms"
import { applyServerAliasSnapshot$, applyServerRelatedTermSnapshot$ } from "./ui.actions"
import { isCanSave$, termMetaDiff$ } from "./ui.selectors"
import { type SaveSuccess } from "./types"
import type { JSONContent } from "@tiptap/react"
import { useMutation, useMutationState } from "@tanstack/react-query"
import { BatchActionError } from "~/libs/error"

export function useTermContentSaveUi(termId: number) {
  const isCanSave = useAtomValue(isCanSave$)
  const isDirtyEditor = useAtomValue(isDirtyContent$)

  const termTitle = useAtomValue(termTitle$)
  const termMetaDiff = useAtomValue(termMetaDiff$)
  const applyServerAliasSnapshot = useSetAtom(applyServerAliasSnapshot$)
  const applyServerRelatedTermSnapshot = useSetAtom(applyServerRelatedTermSnapshot$)

  const { mutate, isPending } = useMutation<SaveSuccess, BatchActionError, JSONContent | null>({
    mutationKey: ["terms", termId, "edit"],
    mutationFn: (content: JSONContent | null) =>
      fetch(`/api/terms/${termId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...termMetaDiff, title: termTitle, content })
      }).then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new BatchActionError("Failed to update term.", data)
        return data
      }),
    onSuccess: ({ alias, related }) => {
      applyServerAliasSnapshot(alias.created, alias.deleted)
      applyServerRelatedTermSnapshot(related.created, related.deleted)
    }
  })

  return {
    isCanSave,
    isDirtyEditor,
    save: mutate,
    isSaving: isPending
  }
}

export const useTermContentsSavingState = (termId: number) => {
  const [isSaving] = useMutationState({
    filters: { mutationKey: ["terms", termId, "edit"] },
    select: (mutation) => mutation.state.status === "pending"
  })

  return { isSaving }
}
