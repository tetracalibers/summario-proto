// ref: https://www.makotot.dev/posts/effective-react-query-keys-translation-ja

export const termKeys = {
  all: ["terms"] as const,
  details: () => [...termKeys.all, "detail"] as const,
  detail: (id: number) => [...termKeys.details(), id] as const,
  preview: (id: number) => [...termKeys.detail(id), "preview"] as const
}

export const folderKeys = {
  all: ["folders"] as const,
  details: () => [...folderKeys.all, "detail"] as const,
  detail: (id: string) => [...folderKeys.details(), id] as const,
  children: (id: string) => [...folderKeys.detail(id), "children"] as const
}
