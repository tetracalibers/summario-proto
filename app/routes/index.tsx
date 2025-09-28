import TipTapEditor from "~/components/editor/Editor"
import styles from "./index.module.css"
import BlockTypeMenu from "~/components/block-menu/BlockTypeMenu"
import FolderTree from "~/components/folder-tree/FolderTree"
import { folderTreeDummyData } from "~/dummy/folder-tree-data"
import TiptapProvider from "~/components/editor/TiptapProvider"
import { Accordion, Button, ScrollArea } from "@mantine/core"

export default function Index() {
  return (
    <TiptapProvider>
      <div className={styles.root}>
        <header className={styles.header}>
          <Button variant="gradient" gradient={{ from: "gray", to: "cyan", deg: 207 }} radius="sm">
            Cancel
          </Button>
          <Button variant="gradient" gradient={{ from: "pink", to: "red", deg: 90 }} radius="sm">
            Delete
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "grape", to: "indigo", deg: 90 }}
            radius="sm"
            className={styles.save_btn}
          >
            Save
          </Button>
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
          <Accordion variant="contained" multiple defaultValue={["alias"]}>
            <Accordion.Item value="alias">
              <Accordion.Control>エイリアスの設定</Accordion.Control>
              <Accordion.Panel>Alias Input</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="related">
              <Accordion.Control>関連用語の設定</Accordion.Control>
              <Accordion.Panel>Related Input</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="references">
              <Accordion.Control>参考文献の設定</Accordion.Control>
              <Accordion.Panel>References Input</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <ScrollArea h="100%" pr="1rem">
            <BlockTypeMenu />
          </ScrollArea>
        </div>
      </div>
    </TiptapProvider>
  )
}
