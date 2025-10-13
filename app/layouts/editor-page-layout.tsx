import "./editor-page.css"

import { Outlet } from "react-router"
import type { Route } from "./+types/editor-page-layout"
import { Paper } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import ScrollArea from "~/components/scroll-area/ScrollArea"
import FolderExplorer from "~/components/folder-explorer/FolderExplorer"
import { getTermById } from "~/service/term"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params

  const term = await getTermById(Number(termId))
  const currentFolderId = term?.folderId ?? null

  return { currentFolderId }
}

export default function EditorPageLayout({ loaderData }: Route.ComponentProps) {
  const { currentFolderId } = loaderData

  return (
    <div className="editor-page">
      {/* <div className="search-area">
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div> */}
      <div className="leftside-area">
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane minHeight="40%">
            <Paper shadow="xs" withBorder p="0" h="100%">
              <ScrollArea h="100%" p="1rem">
                <FolderExplorer currentFolderId={currentFolderId} />
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
