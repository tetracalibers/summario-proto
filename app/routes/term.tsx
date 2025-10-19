import "~/styles/editor-page.css"

import "@mantine/tiptap/styles.css"
import "~/styles/tiptap.css"

import { Paper, Stack } from "@mantine/core"
import SaveButton from "~/components/term-note/SaveButton"
import EditorWith from "~/components/editor/EditorWith"
import type { Route } from "./+types/term"
import AliasInput from "~/components/alias-input/AliasInput"
import RelatedTermView from "~/components/related-term-view/RelatedTermView"
import RelatedInput from "~/components/related-input/RelatedInput"
import FolderPath from "~/components/folder-path/FolderPath"
import { getFolder, getFolderPath } from "~/queries/folder-detail/reader.server"
import EditorActionMenu from "~/components/editor-action-menu/EditorActionMenu"
import { Split } from "@gfazioli/mantine-split-pane"
import FolderExplorer from "~/components/folder-explorer/FolderExplorer"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import { useLocation } from "react-router"
import React from "react"
import ScrollArea from "~/components/scroll-area/ScrollArea"
import { getTermWithMeta } from "~/queries/term-detail/reader.server"
import { getFolderChildren } from "~/queries/folder-children/reader.server"
import { getRelatedTermOptions } from "~/queries/term-list/reader.server"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params

  const { term, alias, related } = await getTermWithMeta(termId)

  const folderId = term.folderId ? Number(term.folderId) : null
  const [entries, current, paths, relatedOptions] = await Promise.all([
    getFolderChildren(folderId),
    getFolder(folderId),
    getFolderPath(folderId),
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
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane>
            <Paper shadow="0" withBorder p="0" h="100%">
              <FolderExplorer
                currentTermId={term.id}
                initials={initialFolders}
                pathFolderIds={new Set(paths.map((p) => p.id))}
              />
            </Paper>
          </Split.Pane>
          <Split.Resizer />
          <Split.Pane grow minHeight="20%">
            <ScrollArea h="100%" pb="0.5rem">
              <BlockTypeMenu />
            </ScrollArea>
          </Split.Pane>
        </Split>
      </div>

      <React.Fragment key={location.pathname}>
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
              initials={related.filter((n) => n.id !== term.id)}
              options={relatedOptions}
            />
          </Stack>
          <RelatedTermView centerNode={{ id: term.id, title: term.title }} />
        </div>
      </React.Fragment>
    </div>
  )
}
