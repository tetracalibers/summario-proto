import "./editor-page.css"

import { Outlet } from "react-router"
import type { Route } from "./+types/editor-page-layout"
import { getFolderContents } from "~/service/folder"
import { Paper } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import ScrollArea from "~/components/scroll-area/ScrollArea"
import FolderExplorer from "~/components/folder-explorer/FolderExplorer"

export async function loader({ params, request }: Route.LoaderArgs) {
  const { termId } = params

  const url = new URL(request.url)
  const dirQuery = url.searchParams.get("dir")
  const dir = dirQuery ? dirQuery : null

  const folderContents = await getFolderContents(dir)

  return { folderContents, termId }
}

export default function EditorPageLayout({ loaderData }: Route.ComponentProps) {
  const { folderContents, termId } = loaderData

  return (
    <div className="editor-page">
      {/* <div className="search-area">
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div> */}
      <div className="leftside-area">
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane>
            <Paper shadow="xs" withBorder p="0" h="100%">
              <ScrollArea h="100%" p="1rem">
                <FolderExplorer currentTermId={termId} items={folderContents} />
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
