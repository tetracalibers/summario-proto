import type { Term } from "~/db/schema"

export const sortTermsByNearestFolder = (terms: Term[], folderId: number | null) => {
  // folderId が null の場合、親がない用語が優先されるようにする
  if (!folderId) {
    return terms.sort((a, b) => {
      const aDistance = a.folderId ? 1 : 0
      const bDistance = b.folderId ? 1 : 0
      return aDistance - bDistance
    })
  }

  return terms.sort((a, b) => {
    const aDistance = a.folderId === folderId ? 0 : 1
    const bDistance = b.folderId === folderId ? 0 : 1
    return aDistance - bDistance
  })
}
