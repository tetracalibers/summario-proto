import { selectRecentTerm, selectTermById } from "~/db/query"
import type { Term } from "~/db/schema"

const withEditorContent = (term: Term) => {
  return {
    ...term,
    editorContent: term.title + "\n" + term.content
  }
}

export const getTermById = async (id: string) => {
  const [term] = await selectTermById(Number(id))
  return term ? withEditorContent(term) : null
}

// 直近編集された用語ノートを取得
export const getRecentTerm = async () => {
  const [terms] = await selectRecentTerm(1)
  return terms ? withEditorContent(terms) : null
}
