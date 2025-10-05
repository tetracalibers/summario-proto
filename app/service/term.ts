import { selectRecentTerm, selectTermById } from "~/db/query"
import {
  deleteAliases,
  deleteTermEdges,
  insertAliases,
  insertTermEdges,
  updateTermContent
} from "~/db/update"

export const getTermById = async (id: number) => {
  const [term] = await selectTermById(id)
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await selectRecentTerm(1)
  return terms
}

interface Rejected {
  key: string
  targets: (number | string)[]
  reason: PromiseRejectedResult["reason"]
}
interface SaveSuccess {
  ok: true
  alias: { created: { id: number; title: string }[]; deleted: { id: number; title: string }[] }
  related: { created: { id: number; title: string }[]; deleted: { id: number; title: string }[] }
}
interface SaveFailure {
  ok: false
  rejected: Rejected[]
}

export const saveTermContentAndMeta = async (
  termId: number,
  payload: {
    content?: any
    alias: { add: string[]; remove: number[] }
    related: { add: number[]; remove: number[] }
  }
): Promise<SaveSuccess | SaveFailure> => {
  const { content, alias, related } = payload

  const tasks = [
    {
      key: "content",
      condition: content !== undefined,
      action: () => updateTermContent(termId, content),
      targets: [termId]
    },
    {
      key: "alias.add",
      condition: alias.add && alias.add.length > 0,
      action: () => insertAliases(termId, alias.add),
      targets: alias.add
    },
    {
      key: "alias.remove",
      condition: alias.remove && alias.remove.length > 0,
      action: () => deleteAliases(alias.remove),
      targets: alias.remove
    },
    {
      key: "related.add",
      condition: related.add && related.add.length > 0,
      action: () => insertTermEdges(termId, related.add),
      targets: related.add
    },
    {
      key: "related.remove",
      condition: related.remove && related.remove.length > 0,
      action: () => deleteTermEdges(termId, related.remove),
      targets: related.remove
    }
  ]

  const results = await Promise.allSettled(
    tasks.map((t) => (t.condition ? t.action() : Promise.resolve([])))
  )

  const rejected: Rejected[] = []
  results.forEach((result, idx) => {
    if (result.status !== "rejected") return
    const task = tasks[idx]
    rejected.push({ key: task.key, targets: task.targets, reason: result.reason })
  })

  if (rejected.length > 0) {
    console.error("Failed to update term:", rejected)
    return { ok: false, rejected }
  }

  const createdAliases = results[1].status === "fulfilled" ? results[1].value : []
  const deletedAliases = results[2].status === "fulfilled" ? results[2].value : []
  const createdEdges = results[3].status === "fulfilled" ? results[3].value : []
  const deletedEdges = results[4].status === "fulfilled" ? results[4].value : []

  return {
    ok: true,
    alias: { created: createdAliases, deleted: deletedAliases },
    related: { created: createdEdges, deleted: deletedEdges }
  }
}
