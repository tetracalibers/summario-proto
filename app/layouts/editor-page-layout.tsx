import "./editor-page.css"

import { Outlet } from "react-router"
import type { Route } from "./+types/editor-page-layout"
import { getFolderPath, getFolderTree } from "~/service/folder"
import { getAllSearchKeywords } from "~/service/search"
import { Autocomplete, Paper, type TreeNodeData } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import FolderTree from "~/components/folder-tree/FolderTree"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import ScrollArea from "~/components/scroll-area/ScrollArea"

export async function loader({ params }: Route.LoaderArgs) {
  const { termId } = params

  const [folderTree, searchKeywords, currentFolderPath] = await Promise.all([
    getFolderTree(),
    getAllSearchKeywords(),
    getFolderPath(termId)
  ])
  return { folderTree, searchKeywords, currentFolderPath }
}

export default function EditorPageLayout({ loaderData }: Route.ComponentProps) {
  const { folderTree, searchKeywords, currentFolderPath } = loaderData

  return (
    <div className="editor-page">
      <div className="search-area">
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div>
      <div className="leftside-area">
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane>
            <Paper shadow="xs" withBorder p="0" h="100%">
              <ScrollArea h="100%" p="1rem">
                <FolderTree
                  data={folderTree as TreeNodeData[]}
                  currentFolderPath={currentFolderPath}
                />
              </ScrollArea>
            </Paper>
          </Split.Pane>
          <Split.Resizer />
          <Split.Pane grow minHeight="20%">
            <ScrollArea h="100%" pb="0.5rem">
              <BlockTypeMenu />
              <div>TODO: 参考書籍ブロック</div>
            </ScrollArea>
          </Split.Pane>
        </Split>
      </div>
      <Outlet />
    </div>
  )
}
