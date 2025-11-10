import type { JSONContent } from "@tiptap/react"

type MetaItem = { id: number; title: string }

export type SavePayload = {
  title: string
  content: JSONContent | null
  alias: { add: Omit<MetaItem, "id">[]; remove: MetaItem[] }
  related: { add: MetaItem[]; remove: MetaItem[] }
}

export type SavingTask =
  | {
      key: "content"
      condition: boolean
      action: () => Promise<MetaItem[]>
      targets: number
    }
  | {
      key: "alias.add"
      condition: boolean
      action: () => Promise<MetaItem[]>
      targets: Omit<MetaItem, "id">[]
    }
  | {
      key: "alias.remove"
      condition: boolean
      action: () => Promise<MetaItem[]>
      targets: MetaItem[]
    }
  | {
      key: "related.add"
      condition: boolean
      action: () => Promise<MetaItem[]>
      targets: MetaItem[]
    }
  | {
      key: "related.remove"
      condition: boolean
      action: () => Promise<MetaItem[]>
      targets: MetaItem[]
    }

type DistributivePick<T, K extends keyof T> = T extends any ? Pick<T, K> : never
export type SaveRejected = DistributivePick<SavingTask, "key" | "targets"> & { reason: unknown }

export interface SaveSuccess {
  ok: true
  alias: { created: MetaItem[]; deleted: MetaItem[] }
  related: { created: MetaItem[]; deleted: MetaItem[] }
}
export interface SaveFailure {
  ok: false
  rejected: SaveRejected[]
}
