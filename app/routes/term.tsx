import { Stack } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import { getTermById } from "~/service/term"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import { getRelatedTerms, getRelatedTermsSuggestions } from "~/service/related-term"
import { getTermAlias } from "~/service/alias"
import AliasInput from "~/components/alias-input/AliasInput"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"
import RelatedInput from "~/components/related-input/RelatedInput"
import FolderPath from "~/components/folder-path/FolderPath"
import { getFolderPath } from "~/service/folder"
import EditorActionMenu from "~/components/editor-action-menu/EditorActionMenu"

export async function loader({ params }: Route.LoaderArgs) {
  const termId = Number(params.termId)

  const [term, alias, nodes] = await Promise.all([
    getTermById(termId),
    getTermAlias(termId),
    getRelatedTerms(termId)
  ])
  const relatedSuggestions = await getRelatedTermsSuggestions(term)

  const folderId = term?.folderId ? Number(term.folderId) : null
  const paths = (await getFolderPath(folderId)) ?? []

  return { term, nodes, alias, relatedSuggestions, paths }
}

export default function Term({ loaderData }: Route.ComponentProps) {
  const { term, nodes, alias, relatedSuggestions, paths } = loaderData

  return (
    <>
      <EditorWith initialJSON={term.content}>
        <div className="controls-area">
          <FolderPath folders={paths} />
          <EditorActionMenu />
        </div>
        <div className="save-area">
          <SaveButton />
        </div>
      </EditorWith>
      <div className="rightside-area">
        <Stack gap="xs">
          <AliasInput initials={alias} />
          <RelatedInput
            initials={nodes.filter((n) => n.id !== term.id)}
            suggestions={relatedSuggestions}
          />
        </Stack>
        <RelatedTermView centerNode={{ id: term.id, title: term.title }} />
      </div>
    </>
  )
}
