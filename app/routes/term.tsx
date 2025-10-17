import "~/styles/editor-page.css"

import "@mantine/tiptap/styles.css"
import "~/styles/tiptap.css"

import { Paper, Stack } from "@mantine/core"
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
import { getFolder, getFolderContents, getFolderPath } from "~/service/folder"
import EditorActionMenu from "~/components/editor-action-menu/EditorActionMenu"
import { Split } from "@gfazioli/mantine-split-pane"
import FolderExplorer from "~/components/folder-explorer/FolderExplorer"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import { useLocation } from "react-router"
import React from "react"
import ScrollArea from "~/components/scroll-area/ScrollArea"

export async function loader({ params }: Route.LoaderArgs) {
  const termId = Number(params.termId)

  const [term, alias, nodes] = await Promise.all([
    getTermById(termId),
    getTermAlias(termId),
    getRelatedTerms(termId)
  ])

  const folderId = term.folderId ? Number(term.folderId) : null
  const [entries, current, paths] = await Promise.all([
    getFolderContents(folderId),
    getFolder(folderId),
    getFolderPath(folderId)
  ])

  const relatedSuggestions = await getRelatedTermsSuggestions(term)

  return {
    term,
    nodes,
    alias,
    relatedSuggestions,
    paths: paths ?? [],
    initialFolders: { current, ...entries }
  }
}

export default function Term({ loaderData }: Route.ComponentProps) {
  const { term, nodes, alias, relatedSuggestions, paths, initialFolders } = loaderData
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
              initials={nodes.filter((n) => n.id !== term.id)}
              suggestions={relatedSuggestions}
            />
          </Stack>
          <RelatedTermView centerNode={{ id: term.id, title: term.title }} />
        </div>
      </React.Fragment>
    </div>
  )
}
