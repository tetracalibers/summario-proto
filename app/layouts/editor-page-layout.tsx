import { Outlet } from "react-router"
import "./editor-page.css"
import type { Route } from "./+types/editor-page-layout"
import { getFolderTree } from "~/service/folder"
import { getAllSearchKeywords } from "~/service/search"
import { Autocomplete, Paper, ScrollArea, type TreeNodeData } from "@mantine/core"
import { Split } from "@gfazioli/mantine-split-pane"
import FolderTree from "~/components/folder-tree/FolderTree"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"

export async function loader({ params }: Route.LoaderArgs) {
  const [folderTree, searchKeywords] = await Promise.all([getFolderTree(), getAllSearchKeywords()])
  return { folderTree, searchKeywords }
}

export default function EditorPageLayout({ loaderData }: Route.ComponentProps) {
  const { folderTree, searchKeywords } = loaderData

  return (
    <div className="editor-page">
      <div className="search-area">
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div>
      <div className="leftside-area">
        <Split orientation="horizontal" h="100%" spacing="md">
          <Split.Pane>
            <Paper shadow="xs" withBorder p="1rem" h="100%">
              <FolderTree data={folderTree as TreeNodeData[]} />
            </Paper>
          </Split.Pane>
          <Split.Resizer />
          <Split.Pane px={"1rem"} grow minHeight="20%">
            <ScrollArea h="100%" pr="1rem" pb="1rem">
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
