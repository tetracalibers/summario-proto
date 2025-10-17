import type { JSONContent } from "@tiptap/react"
import { selectRecentTerm, selectTermById } from "~/db/query"
import {
  deleteAliases,
  deleteTermEdges,
  insertAliases,
  insertTermEdges,
  updateTermContent
} from "~/db/update"
import { debugLog } from "~/lib/debug"

export const getTermById = async (id: number) => {
  const [term] = await selectTermById(id)
  debugLog(term)
  return term
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await selectRecentTerm(1)
  return terms
}

interface Item {
  id: number
  title: string
}

type Task =
  | {
      key: "content"
      condition: boolean
      action: () => Promise<Item[]>
      targets: number
    }
  | {
      key: "alias.add"
      condition: boolean
      action: () => Promise<Item[]>
      targets: Omit<Item, "id">[]
    }
  | {
      key: "alias.remove"
      condition: boolean
      action: () => Promise<Item[]>
      targets: Item[]
    }
  | {
      key: "related.add"
      condition: boolean
      action: () => Promise<Item[]>
      targets: Item[]
    }
  | {
      key: "related.remove"
      condition: boolean
      action: () => Promise<Item[]>
      targets: Item[]
    }

type DistributivePick<T, K extends keyof T> = T extends any ? Pick<T, K> : never
type Rejected = DistributivePick<Task, "key" | "targets"> & { reason: unknown }
interface SaveSuccess {
  ok: true
  alias: { created: Item[]; deleted: Item[] }
  related: { created: Item[]; deleted: Item[] }
}
interface SaveFailure {
  ok: false
  rejected: Rejected[]
}

export const saveTermContentAndMeta = async (
  termId: number,
  payload: {
    content: JSONContent | null
    alias: { add: Omit<Item, "id">[]; remove: Item[] }
    related: { add: Item[]; remove: Item[] }
  }
): Promise<SaveSuccess | SaveFailure> => {
  const { content, alias, related } = payload

  const tasks: Task[] = [
    {
      key: "content",
      condition: content !== null,
      action: () => updateTermContent(termId, content!),
      targets: termId
    },
    {
      key: "alias.add",
      condition: alias.add && alias.add.length > 0,
      action: () =>
        insertAliases(
          termId,
          alias.add.map((a) => a.title)
        ),
      targets: alias.add
    },
    {
      key: "alias.remove",
      condition: alias.remove && alias.remove.length > 0,
      action: () => deleteAliases(alias.remove.map((a) => a.id)),
      targets: alias.remove
    },
    {
      key: "related.add",
      condition: related.add && related.add.length > 0,
      action: () =>
        insertTermEdges(
          termId,
          related.add.map((r) => r.id)
        ),
      targets: related.add
    },
    {
      key: "related.remove",
      condition: related.remove && related.remove.length > 0,
      action: () =>
        deleteTermEdges(
          termId,
          related.remove.map((r) => r.id)
        ),
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
    rejected.push({ key: task.key, targets: task.targets, reason: result.reason } as Rejected)
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
