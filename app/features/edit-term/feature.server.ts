import * as TermService from "~/domains/term/service.server"
import * as AliasService from "~/domains/alias/service.server"
import * as RelatedTermService from "~/domains/related-term/service.server"
import type { SaveFailure, SavePayload, SaveRejected, SaveSuccess, SavingTask } from "./types"

export const saveTermContents = async (
  termId: number,
  payload: SavePayload
): Promise<SaveSuccess | SaveFailure> => {
  const { content, alias, related } = payload

  const tasks: SavingTask[] = [
    {
      key: "content",
      condition: content !== null,
      action: () => TermService.updateTermContent(termId, content!),
      targets: termId
    },
    {
      key: "alias.add",
      condition: alias.add && alias.add.length > 0,
      action: () =>
        AliasService.addAliases(
          termId,
          alias.add.map((a) => a.title)
        ),
      targets: alias.add
    },
    {
      key: "alias.remove",
      condition: alias.remove && alias.remove.length > 0,
      action: () => AliasService.removeAliases(alias.remove.map((a) => a.id)),
      targets: alias.remove
    },
    {
      key: "related.add",
      condition: related.add && related.add.length > 0,
      action: () =>
        RelatedTermService.addRelatedTerms(
          termId,
          related.add.map((r) => r.id)
        ),
      targets: related.add
    },
    {
      key: "related.remove",
      condition: related.remove && related.remove.length > 0,
      action: () =>
        RelatedTermService.removeRelatedTerms(
          termId,
          related.remove.map((r) => r.id)
        ),
      targets: related.remove
    }
  ]

  const results = await Promise.allSettled(
    tasks.map((t) => (t.condition ? t.action() : Promise.resolve([])))
  )

  const rejected: SaveRejected[] = []
  results.forEach((result, idx) => {
    if (result.status !== "rejected") return
    const task = tasks[idx]
    rejected.push({ key: task.key, targets: task.targets, reason: result.reason } as SaveRejected)
  })

  if (rejected.length > 0) {
    console.error("Failed to update term:", rejected)
    return { ok: false, rejected }
  }

  const [_, createdAliases, deletedAliases, createdEdges, deletedEdges] = results.map((result) =>
    result.status === "fulfilled" ? result.value : []
  )

  return {
    ok: true,
    alias: { created: createdAliases, deleted: deletedAliases },
    related: { created: createdEdges, deleted: deletedEdges }
  }
}
