import TipTapEditor from "~/components/editor/Editor"
import styles from "./index.module.css"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import FolderTree from "~/components/folder-tree/FolderTree"
import { folderTreeDummyData } from "~/dummy/folder-tree-data"
import TiptapProvider from "~/components/editor/TiptapProvider"

export default function Index() {
  return (
    <TiptapProvider>
      <div className={styles.root}>
        <header className={styles.header}>Header</header>
        <main className={styles.main}>
          <TipTapEditor />
        </main>
        <div className={styles.side_l}>
          <FolderTree data={folderTreeDummyData} />
        </div>
        <div className={styles.side_r}>
          <BlockTypeMenu />
        </div>
        <footer className={styles.footer}>Footer</footer>
      </div>
    </TiptapProvider>
  )
}
