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
        <header className={styles.header}>
          <pre>Node Title</pre>
          <pre>Alias Input</pre>
          <pre>Save</pre>
          <pre>Delete Note</pre>
        </header>
        <main className={styles.main}>
          <TipTapEditor />
        </main>
        <div className={styles.side_l}>
          <pre>Search Input</pre>
          <FolderTree data={folderTreeDummyData} />
          <pre>Network Graph</pre>
        </div>
        <div className={styles.side_r}>
          <pre>Related Terms Input</pre>
          <pre>References Input</pre>
          <BlockTypeMenu />
        </div>
      </div>
    </TiptapProvider>
  )
}
