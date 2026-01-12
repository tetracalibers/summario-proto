import "~/styles/editor-page.css"

import "@mantine/tiptap/styles.css"
import "~/styles/tiptap.css"

import SaveButton from "~/components/term-save-button/SaveButton"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"
import RelatedInput from "~/components/related-input/RelatedInput"
import FolderPath from "~/components/folder-path/FolderPath"
import { getFolder } from "~/queries/folder-detail/reader.server"
import EditorActionMenu from "~/components/editor-action-menu/EditorActionMenu"
import { useLocation } from "react-router"
import React from "react"
import { getTermWithMeta } from "~/queries/term-detail/reader.server"
import { getFolderChildren } from "~/queries/folder-detail/reader.server"
import { getRelatedTermOptions } from "~/queries/term-list/reader.server"
import { getTermPath } from "~/queries/term-path/reader.server"
import EditorSidebar from "~/components/editor-sidebar/EditorSidebar"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params
  const { term, alias, related } = await getTermWithMeta(Number(termId))

  const folderId = term.folderId ? Number(term.folderId) : null
  const [entries, current, paths, relatedOptions] = await Promise.all([
    getFolderChildren(folderId),
    getFolder(folderId),
    getTermPath(term.id),
    getRelatedTermOptions(term.id, folderId)
  ])

  return {
    term,
    related,
    alias,
    relatedOptions,
    paths: paths ?? [],
    initialFolders: { current, ...entries }
  }
}

export default function Term({ loaderData }: Route.ComponentProps) {
  const { term, related, alias, relatedOptions, paths, initialFolders } = loaderData
  const location = useLocation()

  return (
    <div className="editor-page">
      <div className="leftside-area">
        <EditorSidebar
          currentTermId={term.id}
          initialFolders={initialFolders}
          paths={new Set(paths.map((p) => p.id))}
        />
      </div>

      <React.Fragment key={location.pathname}>
        <EditorWith content={term.content} title={term.title} aliases={alias}>
          <div className="controls-area">
            <FolderPath termId={term.id} initialPath={paths} />
            <EditorActionMenu />
          </div>
          <div className="save-area">
            <SaveButton />
          </div>
        </EditorWith>
        <div className="rightside-area">
          <RelatedInput initials={related} options={relatedOptions} />
          <RelatedTermView initialCenterNode={term} />
        </div>
      </React.Fragment>
    </div>
  )
}
