import "./editor-page.css"

import { Outlet } from "react-router"
import type { Route } from "./+types/editor-page-layout"
import { Paper } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import ScrollArea from "~/components/scroll-area/ScrollArea"
import FolderExplorer from "~/components/folder-explorer/FolderExplorer"
import { getTermById } from "~/service/term"
import { getFolderContents, getFolder } from "~/service/folder"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params

  const term = await getTermById(Number(termId))
  const folderId = term?.folderId ? Number(term.folderId) : null
  const entries = await getFolderContents(folderId)
  const current = await getFolder(folderId)

  return { initialFolder: { current, entries } }
}

export default function EditorPageLayout({ loaderData }: Route.ComponentProps) {
  const { initialFolder } = loaderData

  return (
    <div className="editor-page">
      {/* <div className="search-area">
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div> */}
      <div className="leftside-area">
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane>
            <Paper shadow="xs" withBorder p="0" h="100%">
              <ScrollArea h="100%">
                <FolderExplorer initialFolder={initialFolder} />
              </ScrollArea>
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
      <Outlet />
    </div>
  )
}
