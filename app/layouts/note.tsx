import { Outlet } from "react-router"
import styles from "./note/layout.module.css"
import SideRight from "./note/SideRight"
import SideLeft from "./note/SideLeft"
import { Autocomplete, type TreeNodeData } from "@mantine/core"
import { getFolderTree } from "~/service/folder"
import type { Route } from "./+types/note"
import { getAllSearchKeywords } from "~/service/search"

export async function loader() {
  const [folderTree, searchKeywords] = await Promise.all([getFolderTree(), getAllSearchKeywords()])
  return { folderTree, searchKeywords }
}

export default function NotePageLayout({ loaderData }: Route.ComponentProps) {
  const { folderTree, searchKeywords } = loaderData

  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <Autocomplete placeholder="Search by Title or Alias" data={searchKeywords} />
      </div>
      <div className={styles.side_l}>
        <SideLeft folderTree={folderTree as TreeNodeData[]} />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
      <div className={styles.side_r}>
        <SideRight />
      </div>
    </div>
  )
}
